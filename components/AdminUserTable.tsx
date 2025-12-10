'use client';

import { useState } from 'react';
import { assignPackage } from '@/app/actions/admin';
import { MoreHorizontal, Shield, User, Package, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Profile {
    id: string;
    email: string;
    role: string;
    avatar_url?: string;
}

interface PackageType {
    id: number;
    name: string;
    duration_days: number;
}

export default function AdminUserTable({ users, packages }: { users: Profile[], packages: PackageType[] }) {
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
    const [selectedPkgId, setSelectedPkgId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpenModal = (user: Profile) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        setSelectedPkgId(packages[0]?.id || null);
    };

    const handleAssign = async () => {
        if (!selectedUser || !selectedPkgId) return;
        setLoading(true);
        try {
            await assignPackage(selectedUser.id, selectedPkgId);
            alert('Package assigned successfully!');
            setIsModalOpen(false);
        } catch (e: any) {
            alert('Failed to assign: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#2f3349] rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-[#3b415a]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
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
                                    <button
                                        onClick={() => handleOpenModal(user)}
                                        className="text-primary hover:text-indigo-700 font-medium text-sm flex items-center gap-1"
                                    >
                                        <Package className="w-4 h-4" /> Manage Package
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#2f3349] rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-100 dark:border-zinc-700 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold mb-4 dark:text-white">Assign Package</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Assigning a new package to <span className="font-medium text-gray-900 dark:text-white">{selectedUser.email}</span>.
                        </p>

                        <div className="space-y-4 mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Package</label>
                            <select
                                value={selectedPkgId || ''}
                                onChange={(e) => setSelectedPkgId(Number(e.target.value))}
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
                            >
                                {packages.map(pkg => (
                                    <option key={pkg.id} value={pkg.id}>{pkg.name} ({pkg.duration_days} days)</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={loading}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-600 shadow-lg shadow-primary/20 flex items-center gap-2"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
