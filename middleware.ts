import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {

    console.log("DEBUG URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // CHECK: If environment variables are missing, skip auth to prevent crash
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Middleware: Missing Supabase environment variables. Skipping auth check.');
        return response;
    }

    // Create Supabase client for middleware
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Get User Session
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // 1. If user is NOT logged in and tries to access /dashboard -> Redirect to /login
    if (!user && path.startsWith('/dashboard')) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. If user IS logged in and tries to access /login -> Redirect to /dashboard
    // We allow access to / (root) so they can see the landing page
    if (user && path === '/login') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard/packages' // Default dashboard page
        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - api/ (API routes - generally we want to protect these differently or allow public)
         * - auth/ (Auth callback routes)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|api/|auth/).*)',
    ],
}
