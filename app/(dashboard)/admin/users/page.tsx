import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUsersWithLicenses, getPackages } from '@/app/actions/admin';
import AdminUserList from '@/components/AdminUserList';

export default async function AdminUsersPage() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                },
            },
        }
    );

    // 1. Check Auth & Role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') redirect('/dashboard');

    // 2. Fetch Data (Users + Licenses)
    const users = await getUsersWithLicenses();
    const packages = await getPackages();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">View users and assign licenses.</p>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                    Admin Access
                </div>
            </div>

            <AdminUserList users={users} packages={packages} />
        </div>
    );
}
