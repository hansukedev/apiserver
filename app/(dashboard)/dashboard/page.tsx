import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import {
    Smartphone,
    Key,
    Clock,
    Package,
    Bell,
    Send,
    Users,
    CreditCard,
    TrendingUp,
    Shield,
    LucideIcon
} from 'lucide-react'

export default async function DashboardHome() {
    // 1. Initialize Supabase Server Client
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

    // 2. Get Authenticated User
    const { data: { user } } = await supabase.auth.getUser()

    // 3. Get User Profile (Role & Name)
    let profile = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single()
        profile = data;
    }

    // 4. Determine Admin Status
    const isAdmin = profile?.role === 'admin'

    // 5. Fetch Real Data
    let stats: {
        title: string;
        value: string | number;
        icon: LucideIcon;
        color: string;
        bg: string;
    }[] = [];

    if (isAdmin) {
        // === ADMIN DATA FETCHING ===
        const [
            { count: totalUsers },
            { count: activeKeys },
            { count: totalSold },
            { data: revenueData }
        ] = await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('licenses').select('*', { count: 'exact', head: true }).eq('status', 'active'),
            supabase.from('licenses').select('*', { count: 'exact', head: true }),
            supabase.from('licenses').select('packages(price)')
        ]);

        // Calculate Revenue
        const totalRevenue = revenueData?.reduce((acc: number, curr: any) => {
            return acc + (curr.packages?.price || 0);
        }, 0) || 0;

        // Format Currency
        const formattedRevenue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(totalRevenue);

        stats = [
            { title: 'Total Users', value: totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
            { title: 'Total Revenue', value: formattedRevenue, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-100' },
            { title: 'Active Keys', value: activeKeys || 0, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-100' },
            { title: 'Total Sold', value: totalSold || 0, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-100' },
        ];

    } else {
        // === USER DATA FETCHING ===
        if (user) {
            const [
                { count: myKeys },
                { count: activeDevices },
                { data: userLicenses }
            ] = await Promise.all([
                supabase.from('licenses').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                supabase.from('licenses').select('*', { count: 'exact', head: true }).eq('user_id', user.id).not('hwid', 'is', null),
                supabase.from('licenses')
                    .select('*, packages(name)')
                    .eq('user_id', user.id)
                    .order('end_date', { ascending: false }) // Get latest expiry
                    .limit(1)
            ]);

            const latestLicense = userLicenses?.[0];
            const currentPlan = latestLicense?.packages?.name || 'Free';

            // Calculate Expiry Display
            let expiryDisplay = 'Never';
            let daysLeft = 0;

            if (latestLicense?.end_date) {
                const endDate = new Date(latestLicense.end_date);
                const now = new Date();
                const diffTime = endDate.getTime() - now.getTime();
                daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (daysLeft > 0) {
                    expiryDisplay = `${daysLeft} Days Left`;
                } else {
                    expiryDisplay = 'Expired';
                }
            }

            stats = [
                { title: 'My Keys', value: myKeys || 0, icon: Key, color: 'text-green-500', bg: 'bg-green-100' },
                { title: 'Active Devices', value: activeDevices || 0, icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-100' },
                { title: 'Expiry Date', value: expiryDisplay, icon: Clock, color: 'text-red-500', bg: 'bg-red-100' },
                { title: 'Current Plan', value: currentPlan, icon: Package, color: 'text-purple-500', bg: 'bg-purple-100' },
            ];
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Welcome back, {profile?.full_name || user?.email}
                    </p>
                </div>
                {isAdmin && (
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                        ADMIN MODE
                    </span>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {isAdmin ? (
                    // Admin View: Recent Transactions Main Card
                    <div className="lg:col-span-3">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-lg">
                                <div className="text-center text-gray-400">
                                    <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No recent transactions found.</p>
                                    <p className="text-xs">Transaction data will appear here.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // User View: Account Info & Notifications
                    <>
                        {/* Left Column: Account Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Account Card */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Account information</h2>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                            {user?.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user?.email}</p>
                                            <p className="text-xs text-gray-500">{profile?.full_name || 'Member'}</p>
                                        </div>
                                    </div>

                                    {/* Storage Bar */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Storage</span>
                                            <span>0 B / 1 GB</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Plan Card */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Plan</h2>
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Free Plan</h3>
                                        <p className="text-xs text-gray-500">
                                            {/* NOTE: Need to fetch plan details if needed, for now just placeholder text or logic */}
                                            AC 0 / 1 month(s)
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p className="mb-1 flex justify-between"><span>Valid Until</span> <span>30 days left</span></p>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Auto-renewal: Disabled</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Notifications */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-blue-600">System Notifications</h2>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded flex items-center gap-1 transition">
                                    <Send size={12} /> Telegram
                                </button>
                            </div>

                            <div className="flex flex-col items-center justify-center py-10 text-gray-400 space-y-2">
                                <Bell size={40} className="text-gray-200" />
                                <p>No messages</p>
                                <p className="text-xs">No messages found in this channel</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}