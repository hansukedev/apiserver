'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Smartphone, Unlink } from 'lucide-react';

interface License {
    id: number;
    key_code: string;
    hwid: string;
    packages: {
        name: string;
    } | null;
}

export default function DevicesPage() {
    const [devices, setDevices] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDevices = async () => {
        setLoading(true);
        // Fetch only active licenses that have a HWID
        const { data, error } = await supabase
            .from('licenses')
            .select('*, packages(name)')
            .neq('hwid', null)  // Only w/ HWID
            .eq('status', 'active'); // Only active

        if (error) {
            console.error('Error fetching devices:', error);
        } else {
            // Type assertion or filter needed because .neq('hwid', null) isn't perfect in TS type inference
            setDevices((data as any[]) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const unlinkDevice = async (id: number) => {
        if (!confirm('Are you sure you want to unlink this device?')) return;

        const { error } = await supabase
            .from('licenses')
            .update({ hwid: null })
            .eq('id', id);

        if (error) {
            alert('Failed to unlink device');
        } else {
            fetchDevices();
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Connected Devices</h1>

            <div className="space-y-4">
                {devices.map((device) => (
                    <div
                        key={device.id}
                        className="bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Smartphone className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {device.hwid}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Linked to Key: <span className="font-mono text-gray-700">{device.key_code}</span>
                                </p>
                                <p className="text-xs text-primary mt-0.5">
                                    {device.packages?.name}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => unlinkDevice(device.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm"
                        >
                            <Unlink className="h-4 w-4" />
                            Unlink Device
                        </button>
                    </div>
                ))}

                {devices.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <Smartphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Active Devices</h3>
                        <p className="text-gray-500">Devices will appear here once they activate a license.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
