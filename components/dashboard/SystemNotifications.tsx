'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Send, Bell } from 'lucide-react';
import { format } from 'date-fns';
import useSWR from 'swr';

type Notification = {
    id: string;
    content: string;
    created_at: string;
};

interface SystemNotificationsProps {
    initialData?: Notification[];
}

// Fetcher function
const fetchNotifications = async () => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) throw error;
    return data as Notification[];
};

export default function SystemNotifications({ initialData = [] }: SystemNotificationsProps) {
    const { data: notifications } = useSWR('notifications-list', fetchNotifications, {
        fallbackData: initialData,
        refreshInterval: 10000,
        revalidateOnFocus: true,
    });

    const displayData = notifications || initialData;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-blue-600">System Notifications</h3>
                <a
                    href="https://t.me/apihansuke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded transition-colors"
                >
                    <Send size={12} />
                    <span>Telegram</span>
                </a>
            </div>

            {!displayData || displayData.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-gray-400 space-y-3 py-8">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                        <Bell className="w-8 h-8 text-gray-300" />
                    </div>
                    <div className="text-center">
                        <p className="text-gray-900 font-medium">No messages</p>
                        <p className="text-xs text-gray-500">No messages found in this channel</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                    {displayData.map((note) => (
                        <div key={note.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-sm text-gray-800 mb-1 line-clamp-3">{note.content}</p>
                            <p className="text-[10px] text-gray-400 text-right">
                                {format(new Date(note.created_at), 'HH:mm dd/MM')}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
