import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
    LayoutDashboard, Key, Smartphone, Package,
    Users, CreditCard
} from 'lucide-react'
// Import cái nút vừa tạo
import SignOutButton from '@/components/SignOutButton'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { }
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const isAdmin = profile?.role === 'admin'

    return (
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                        <LayoutDashboard /> APIServer
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    <p className="text-xs text-gray-400 font-semibold mt-4 mb-2 px-2">APPS & PAGES</p>
                    <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="/dashboard/keys" icon={<Key size={20} />} label="Keys" />
                    <NavItem href="/dashboard/devices" icon={<Smartphone size={20} />} label="Devices" />
                    <NavItem href="/dashboard/packages" icon={<Package size={20} />} label="Packages" />

                    {isAdmin && (
                        <>
                            <div className="border-t my-4 border-gray-100"></div>
                            <p className="text-xs text-red-500 font-bold mt-4 mb-2 px-2">ADMINISTRATION</p>
                            <NavItem href="/admin/users" icon={<Users size={20} />} label="Manage Users" />
                        </>
                    )}
                </nav>

                {/* User Profile & Logout */}
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold border border-purple-200">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate w-32 text-gray-800" title={user.email}>{user.email}</p>
                            <p className={`text-xs ${isAdmin ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                {isAdmin ? 'Administrator' : 'Member'}
                            </p>
                        </div>
                    </div>

                    {/* NÚT LOGOUT NẰM ĐÂY */}
                    <SignOutButton />
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors">
            {icon}
            <span>{label}</span>
        </Link>
    )
}