import Link from 'next/link';
import {
    ShoppingCart,
    Receipt,
    Smartphone,
    Key,
    Package,
} from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transition-transform sm:translate-x-0 bg-white border-r border-gray-200">
            <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
                <div className="mb-5 flex items-center pl-2.5">
                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded bg-primary text-white font-bold">
                        A
                    </div>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        APIServer
                    </span>
                </div>
                <ul className="space-y-2 font-medium">
                    {/* Purchase & Invoices */}
                    <li className="pt-4 pb-2">
                        <span className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Purchase & Invoices
                        </span>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >
                            <ShoppingCart className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                            <span className="ms-3">Orders</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >
                            <Receipt className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                            <span className="ms-3">Recharge</span>
                        </Link>
                    </li>

                    {/* Apps & Pages */}
                    <li className="pt-4 pb-2">
                        <span className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Apps & Pages
                        </span>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/devices"
                            className="group flex items-center rounded-lg bg-primary/10 p-2 text-primary dark:text-white"
                        >
                            <Smartphone className="h-5 w-5 flex-shrink-0 text-primary transition duration-75" />
                            <span className="ms-3">Devices</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/keys"
                            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >
                            <Key className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                            <span className="ms-3">Keys</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/dashboard/packages"
                            className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >
                            <Package className="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                            <span className="ms-3">Packages</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
