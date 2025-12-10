import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Check for 'channel_post' (channel messages) or 'message' (direct messages)
        const messageData = body.channel_post || body.message;

        if (messageData && messageData.text) {
            const text = messageData.text;

            // Initialize Supabase Admin Client
            // Uses SERVICE_ROLE_KEY to bypass RLS policies
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            // Insert into notifications table
            const { error } = await supabaseAdmin
                .from('notifications')
                .insert([
                    {
                        content: text,
                        type: 'info', // Default type
                        // created_at is auto-handled by database default
                    }
                ]);

            if (error) {
                console.error('Supabase Insert Error:', error);
                // We still return 200 to Telegram to prevent retry loops on db errors
                return NextResponse.json({ ok: true });
            }
        }

        // Always return 200 OK to acknowledge receipt
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Webhook Error:', error);
        // Even on parsing errors, we return 200 to stop Telegram retries
        return NextResponse.json({ ok: true });
    }
}

export async function GET() {
    // Basic connectivity check
    return NextResponse.json({ status: 'active', service: 'Telegram Webhook' });
}
