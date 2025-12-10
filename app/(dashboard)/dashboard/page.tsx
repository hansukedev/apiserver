import {
    Smartphone,
    Key,
    Ban,
    LayoutGrid,
    RefreshCw,
    Download,
    Send,
    Bell
} from 'lucide-react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import ClientMetricsChart from '@/components/dashboard/ClientMetricsChart';
import SystemNotifications from '@/components/dashboard/SystemNotifications';
import DashboardStats from '@/components/dashboard/DashboardStats';
import CurrentPlanCard from '@/components/dashboard/CurrentPlanCard';
import AccountInfoCard from '@/components/dashboard/AccountInfoCard';
import { differenceInDays, format } from 'date-fns';

export default async function DashboardHome() {
    // 1. Initialize Supabase Server Client
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { }
            },
        }
    );

    // 2. Get Authenticated User
    const { data: { user } } = await supabase.auth.getUser();

    // 3. Get User Profile (Role & Name)
    let profile = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        profile = { ...data, email: user.email };
    }

    // 4. Determine Admin Status
    const isAdmin = profile?.role === 'admin';

    // 5. Fetch Data in Parallel
    const now = new Date().toISOString();

    const [
        { data: notifications },
        { count: devicesCount },
        { count: keysCount },
        { count: expiredCount },
        { count: packagesCount },
        { data: activeLicense }
    ] = await Promise.all([
        // Notifications
        supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10),

        // Devices (HWID not null)
        supabase
            .from('licenses')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user?.id)
            .not('hwid', 'is', null),

        // Keys (Total)
        supabase
            .from('licenses')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user?.id),

        // Expired
        supabase
            .from('licenses')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user?.id)
            .lt('end_date', now),

        // Packages (Active)
        supabase
            .from('licenses')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user?.id)
            .gt('end_date', now),

        // Active License (Latest)
        supabase
            .from('licenses')
            .select('*, packages(*)')
            .eq('user_id', user?.id)
            .eq('status', 'active')
            .order('end_date', { ascending: false })
            .limit(1)
            .single()
    ]);

    const initialStats = {
        devices: devicesCount || 0,
        keys: keysCount || 0,
        expired: expiredCount || 0,
        packages: packagesCount || 0
    };

    // Calculate Plan Data
    let planData = {
        name: 'Free Plan',
        daysLeft: 0,
        totalDuration: 0,
        endDate: '',
        isFree: true
    };

    if (activeLicense && activeLicense.packages) {
        const endDate = new Date(activeLicense.end_date);
        const startDate = new Date(activeLicense.start_date);
        const today = new Date();

        const daysLeft = Math.max(0, differenceInDays(endDate, today));
        const totalDuration = differenceInDays(endDate, startDate);

        // @ts-ignore - packages is joined
        const packageName = activeLicense.packages.name || 'Unknown Plan';

        planData = {
            name: packageName,
            daysLeft,
            totalDuration,
            endDate: format(endDate, 'dd/MM/yyyy HH:mm'),
            isFree: false
        };
    }

    return (
        <div className="p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50/50 min-h-screen">

            {/* 1. Stats Row */}
            <DashboardStats userId={user?.id || ''} initialData={initialStats} />

            {/* 2. Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Left Column (Span 2) --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Account Info & Current Plan Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Account Information Card */}
                        <AccountInfoCard
                            profile={profile}
                            storageUsed={0}
                            storageLimit={1073741824} // 1GB
                        />

                        {/* Current Plan Card */}
                        <CurrentPlanCard planData={planData} />
                    </div>

                    {/* Client Access Metrics */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">Client access metrics</h2>
                            <p className="text-xs text-gray-500">Login count</p>
                        </div>
                        <ClientMetricsChart />
                    </div>

                    {/* Latest Release */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg shadow-blue-200 shadow-md">
                                    <RefreshCw className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        Latest Release
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">v1.0.0</span>
                                    </h2>
                                    <p className="text-xs text-gray-500">10/12/2025</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 mb-2">Changelog</h3>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                                    <li>Added new API endpoints</li>
                                    <li>Fixed bugs in login flow</li>
                                    <li>Improved performance</li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <button className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded text-gray-500 group-hover:text-blue-500 transition">
                                            <Download size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-900">APIClient.h</p>
                                            <p className="text-xs text-gray-500">Header File</p>
                                        </div>
                                    </div>
                                </button>
                                <button className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition group">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded text-gray-500 group-hover:text-blue-500 transition">
                                            <Download size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-900">libAPIClient.a</p>
                                            <p className="text-xs text-gray-500">Library File</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Video Embed */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
                            {/* Placeholder for YouTube Embed */}
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=adS8vU1T9n8Xh3vE"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className="absolute inset-0"
                            ></iframe>
                        </div>
                    </div>

                </div>


                {/* --- Right Column (Span 1) --- */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Contact Widget */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send className="w-8 h-8 text-blue-500" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Contact Support</h2>
                        <p className="text-sm text-gray-500 mb-6">Contact us for any questions or issues.</p>
                        <a href="https://t.me/hansukedev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors w-fit">
                            <Send size={18} />
                            <div>
                                <p className="text-ts text-gray-500 font-medium">Telegram</p>
                                <p className="text-xs font-bold">@hansukedev</p>
                            </div>
                        </a>
                    </div>

                    {/* System Notifications */}
                    <SystemNotifications initialData={notifications || []} />
                </div>
            </div>
        </div>
    );
}
