import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { key, hwid } = body;

        if (!key || !hwid) {
            return NextResponse.json(
                { valid: false, message: 'Missing key or hwid' },
                { status: 400 }
            );
        }

        // 1. Query the license key
        const { data: license, error } = await supabase
            .from('licenses')
            .select('*')
            .eq('key_code', key)
            .single();

        if (error || !license) {
            return NextResponse.json({
                valid: false,
                message: 'License key not found',
            });
        }

        // 2. Check existence is implied by query success
        // 3. Check status
        if (license.status !== 'active') {
            return NextResponse.json({
                valid: false,
                message: `License is ${license.status}`,
            });
        }

        // 4. Check expiration
        if (new Date(license.expiration_date) < new Date()) {
            return NextResponse.json({
                valid: false,
                message: 'License has expired',
                expires: license.expiration_date,
            });
        }

        // 5. HWID Logic
        if (!license.hwid) {
            // First time activation: Update HWID
            const { error: updateError } = await supabase
                .from('licenses')
                .update({ hwid: hwid })
                .eq('id', license.id);

            if (updateError) {
                return NextResponse.json(
                    { valid: false, message: 'Failed to bind device' },
                    { status: 500 }
                );
            }

            return NextResponse.json({
                valid: true,
                message: 'License activated successfully',
                expires: license.expiration_date,
            });
        } else if (license.hwid !== hwid) {
            // HWID mismatch
            return NextResponse.json({
                valid: false,
                message: 'Invalid Device',
            });
        }

        // HWID matches
        return NextResponse.json({
            valid: true,
            message: 'License valid',
            expires: license.expiration_date,
        });
    } catch (err) {
        console.error('API Error:', err);
        return NextResponse.json(
            { valid: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
