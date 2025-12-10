'use client';

import { useState } from 'react';
import { Shield, User, Package, Calendar } from 'lucide-react';
import Image from 'next/image';
import AssignPackageModal from './AssignPackageModal';

interface License {
    id: number;
    status: string;
    end_date: string;
    packages: {
        name: string;
    };
}

interface Profile {
    id: string;
    email: string;
    role: string;
    avatar_url?: string;
    license?: License;
}

interface PackageType {
    id: number;
    name: string;
    duration_days: number;
}

export default function AdminUserList({ users, packages }: { users: Profile[], packages: PackageType[] }) {
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (user: Profile) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white dark:bg-[#2f3349] rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-[#3b415a]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Info</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Package</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#3b415a]/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
                                            {user.avatar_url ? (
                                                <Image src={user.avatar_url} alt={user.email} width={40} height={40} />
                                            ) : (
                                                <span className="text-gray-500 font-medium">{user.email?.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{user.email}</div>
                                            <div className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        }`}>
                                        {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.license ? (
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-primary dark:text-[#7367F0] pb-1">
                                                {user.license.packages?.name || 'Unknown Package'}
                                            </span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Exp: {new Date(user.license.end_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-gray-400">Free User</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleOpenModal(user)}
                                        className="text-primary hover:text-indigo-700 font-medium text-sm flex items-center gap-1 transition-colors"
                                    >
                                        <Package className="w-4 h-4" /> Assign Package
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AssignPackageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userEmail={selectedUser?.email || ''}
                userId={selectedUser?.id || ''}
                packages={packages}
            />
        </div>
    );
}
