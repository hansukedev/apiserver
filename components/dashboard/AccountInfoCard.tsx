import { User } from 'lucide-react';
import Image from 'next/image';

interface AccountInfoProps {
    profile: {
        email?: string;
        full_name?: string | null;
        role?: string;
        avatar_url?: string | null;
    } | null;
    storageUsed: number;
    storageLimit: number;
}

export default function AccountInfoCard({ profile, storageUsed, storageLimit }: AccountInfoProps) {
    // Format storage
    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formattedUsed = formatBytes(storageUsed);
    const formattedLimit = formatBytes(storageLimit);

    const percentage = Math.min(100, Math.max(0, (storageUsed / storageLimit) * 100));

    // Handle display name and avatar
    const displayName = profile?.full_name || profile?.email || 'User';
    // Use first char of name or email for fallback avatar
    const avatarFallback = (displayName[0] || 'U').toUpperCase();
    const displayRole = profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Member';

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-full">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Account information</h2>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">Active</span>
                </div>
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center relative shrink-0">
                        {profile?.avatar_url ? (
                            <Image
                                src={profile.avatar_url}
                                alt="Avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-gray-500 font-bold text-lg">{avatarFallback}</span>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 truncate max-w-[150px]" title={displayName}>{displayName}</p>
                        <p className="text-xs text-gray-500">{displayRole}</p>
                    </div>
                </div>
            </div>

            {/* Storage Bar */}
            <div>
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Storage</span>
                    <span>{formattedUsed} / {formattedLimit}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
