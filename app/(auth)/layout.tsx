import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-white dark:bg-[#0f111a]">
            {/* Left Column - Image & Brand */}
            <div className="hidden lg:flex w-2/3 bg-[#F8F7FA] dark:bg-[#161d31] relative items-center justify-center p-12 overflow-hidden">
                {/* Logo */}
                <div className="absolute top-8 left-8 flex items-center gap-2 z-20">
                    <div className="h-8 w-8 bg-[#7367F0] rounded-lg flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">APIServer</span>
                </div>

                {/* Floating Stat Card 1 */}
                <div className="absolute top-1/4 left-1/4 bg-white dark:bg-[#2f3349] p-4 rounded-xl shadow-lg z-10 animate-float-slow max-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-lg">💡</div>
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-100">License Active</h4>
                            <p className="text-xs text-gray-500">Verified</p>
                        </div>
                    </div>
                </div>

                {/* Floating Stat Card 2 */}
                <div className="absolute bottom-1/4 right-1/4 bg-white dark:bg-[#2f3349] p-4 rounded-xl shadow-lg z-10 animate-float-delayed max-w-[200px]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-[#7367F0]/10 text-[#7367F0] flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-gray-100">Uptime 99.9%</h4>
                            <p className="text-xs text-gray-500">Last 30 days</p>
                        </div>
                    </div>
                </div>

                {/* Main 3D Illustration */}
                <div className="relative z-0 w-full max-w-lg">
                    <Image
                        src="/auth-illustration.png"
                        alt="Auth Illustration"
                        width={800}
                        height={800}
                        className="object-contain drop-shadow-2xl"
                        priority
                    />
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-1/3 flex items-center justify-center p-8 lg:p-12 relative">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
