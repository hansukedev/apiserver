'use client';

import { useState } from 'react';
import { assignPackage } from '@/app/actions/admin';
import { Loader2 } from 'lucide-react';

interface PackageType {
    id: number;
    name: string;
    duration_days: number;
}

interface AssignPackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
    userId: string;
    packages: PackageType[];
}

export default function AssignPackageModal({ isOpen, onClose, userEmail, userId, packages }: AssignPackageModalProps) {
    const [selectedPkgId, setSelectedPkgId] = useState<number>(packages[0]?.id || 0);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleAssign = async () => {
        if (!selectedPkgId) return;
        setLoading(true);
        try {
            await assignPackage(userId, selectedPkgId);
            onClose(); // Close modal on success (page will revalidate)
            alert('Package assigned successfully!');
        } catch (e: any) {
            alert('Failed to assign: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#2f3349] rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-100 dark:border-zinc-700">
                <h3 className="text-lg font-bold mb-4 dark:text-white">Assign Package</h3>
                <p className="text-gray-500 text-sm mb-6">
                    Manage license for <span className="font-medium text-gray-900 dark:text-white">{userEmail}</span>.
                </p>

                <div className="space-y-4 mb-8">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Package</label>
                    <select
                        value={selectedPkgId}
                        onChange={(e) => setSelectedPkgId(Number(e.target.value))}
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary transition-colors"
                    >
                        {packages.map(pkg => (
                            <option key={pkg.id} value={pkg.id}>
                                {pkg.name} ({pkg.duration_days} days)
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-600 shadow-lg shadow-primary/20 flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
