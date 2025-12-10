'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            router.push('/dashboard/packages');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome to APIServer! 👋</h2>
                <p className="text-gray-500 dark:text-gray-400">Please sign-in to your account and start the adventure</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email
                    </label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-[#2f3349] text-gray-900 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7367F0] focus:border-[#7367F0] transition-colors"
                        placeholder="john@example.com"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <Link href="/forgot-password" className="text-sm text-[#7367F0] hover:text-[#685dd8]">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full px-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-[#2f3349] text-gray-900 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7367F0] focus:border-[#7367F0] transition-colors"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-[#7367F0] focus:ring-[#7367F0] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-400">
                        Remember Me
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#7367F0] hover:bg-[#685dd8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7367F0] transition-all shadow-[#7367F0]/40 hover:shadow-lg disabled:opacity-50"
                >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign in'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    New on our platform?{' '}
                    <Link href="/register" className="font-medium text-[#7367F0] hover:text-[#685dd8]">
                        Create an account
                    </Link>
                </p>
            </div>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-zinc-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-[#0f111a] text-gray-500">or</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <button type="button" className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white dark:bg-[#2f3349] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#3b415a]">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Google
                    </button>
                    {/* Twitter/Github could go here similarly */}
                </div>
            </div>
        </div>
    );
}
