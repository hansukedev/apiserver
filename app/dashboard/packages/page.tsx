'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package } from 'lucide-react';

interface PackageData {
    id: number;
    name: string;
    duration_days: number;
    price: number;
}

export default function PackagesPage() {
    const [packages, setPackages] = useState<PackageData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPackages() {
            const { data, error } = await supabase.from('packages').select('*');
            if (error) {
                console.error('Error fetching packages:', error);
            } else {
                setPackages(data || []);
            }
            setLoading(false);
        }
        fetchPackages();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Packages</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 rounded-lg">
                                <Package className="h-8 w-8 text-primary" />
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                Active
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                        <div className="mt-4 flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900">
                                ${pkg.price}
                            </span>
                            <span className="ml-1 text-gray-500">
                                / {pkg.duration_days} Days
                            </span>
                        </div>
                        <button className="mt-6 w-full bg-primary text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                            Edit Package
                        </button>
                    </div>
                ))}

                {packages.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        No packages found. Please populate the database.
                    </div>
                )}
            </div>
        </div>
    );
}
