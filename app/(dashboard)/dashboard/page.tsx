import {
    Smartphone,
    Key,
    Ban,
    LayoutGrid,
    User,
    RefreshCw,
    Download,
    Send,
    Bell
} from 'lucide-react';
import Image from 'next/image';
import ClientMetricsChart from '@/components/dashboard/ClientMetricsChart';

export default async function DashboardHome() {
    // Mock Data
    const stats = [
        { title: 'Devices', value: '1', icon: Smartphone, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Keys', value: '1', icon: Key, color: 'text-green-500', bg: 'bg-green-50' },
        { title: 'Devices Expired', value: '0', icon: Ban, color: 'text-red-500', bg: 'bg-red-50' },
        { title: 'Packages', value: '3', icon: LayoutGrid, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    ];

    return (
        <div className="p-6 md:p-8 space-y-6 md:space-y-8 bg-gray-50/50 min-h-screen">

            {/* 1. Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Left Column (Span 2) --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Account Info & Current Plan Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Account Information Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">Account information</h2>
                                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                                </div>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                                        {/* Placeholder Avatar */}
                                        <User className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">hansuke</p>
                                        <p className="text-xs text-gray-500">Member</p>
                                    </div>
                                </div>
                            </div>

                            {/* Storage Bar */}
                            <div>
                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                    <span>Storage</span>
                                    <span>0 B / 1 GB</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-blue-500 h-full rounded-full w-0" />
                                </div>
                            </div>
                        </div>

                        {/* Current Plan Card */}
                        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Plan</h2>
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <RefreshCw className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <span className="text-xl font-bold text-gray-800">Free</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-500">Valid Until</span>
                                        <span className="text-gray-900 font-medium">30 days left</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-green-500 h-full rounded-full w-1/4" />
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-xs text-gray-500">Keys: <span className="text-gray-900 font-medium">0 / 0</span></p>
                                    <p className="text-xs text-gray-500">Packages: <span className="text-gray-900 font-medium">0 / 0</span></p>
                                </div>
                            </div>
                        </div>
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
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow-green-200 shadow-md">
                            <Send size={18} />
                            Telegram
                        </button>
                    </div>

                    {/* System Notifications */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1 transition">
                                <Send size={10} /> Telegram
                            </button>
                        </div>

                        <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-3">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                <Bell className="w-8 h-8 text-gray-300" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-900 font-medium">No messages</p>
                            <p className="text-xs text-gray-500">No messages found in this channel</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
