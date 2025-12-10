'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface License {
    id: number;
    key_code: string;
    status: string;
    hwid: string | null;
    end_date: string | null;
    expiration_date: string | null; // fallback
    packages: {
        name: string;
    } | null;
}

export default function KeysPage() {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch licenses
    const fetchLicenses = async () => {
        setLoading(true);
        // Since we are using "Enable all access" policy for dev, we can fetch all.
        // Ideally, we filter by user in the query itself if auth is working.
        // .eq('user_id', user.id)

        // Join with packages table
        const { data, error } = await supabase
            .from('licenses')
            .select('*, packages(name)')
            .order('id', { ascending: false });

        if (error) {
            console.error('Error fetching licenses:', error);
        } else {
            setLicenses(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLicenses();
    }, []);

    // Reset HWID Handler
    const resetHWID = async (id: number) => {
        const { error } = await supabase
            .from('licenses')
            .update({ hwid: null })
            .eq('id', id);

        if (error) {
            alert('Failed to reset HWID');
        } else {
            // Refresh list
            fetchLicenses();
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Keys</h1>
                <button
                    onClick={fetchLicenses}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Key Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Package
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                HWID Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Expires
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {licenses.map((license) => (
                            <tr key={license.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {license.key_code}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {license.packages?.name || 'Unknown Package'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {license.status === 'active' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            {license.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {license.hwid ? (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <CheckCircle className="h-4 w-4" /> Linked
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-gray-400">
                                            <XCircle className="h-4 w-4" /> Not Linked
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {license.end_date || license.expiration_date
                                        ? new Date(license.end_date || license.expiration_date!).toLocaleDateString()
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => resetHWID(license.id)}
                                        className="text-primary hover:text-indigo-900"
                                    >
                                        Reset HWID
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {licenses.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No licenses found</div>
                )}
            </div>
        </div>
    );
}
