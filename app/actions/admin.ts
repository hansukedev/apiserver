'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'

async function createSupabaseServerClient() {
    const cookieStore = await cookies()
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return cookieStore.getAll() },
                setAll() { }
            },
        }
    )
}

// === HÀM NÀY ĐÃ ĐƯỢC VIẾT LẠI ĐỂ TRÁNH LỖI JOIN ===
export async function getUsersWithLicenses() {
    const supabase = await createSupabaseServerClient()

    // 1. Lấy danh sách Users trước
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (profileError) {
        console.error('Lỗi lấy Profiles:', JSON.stringify(profileError, null, 2))
        return []
    }

    // 2. Lấy danh sách Licenses riêng
    const { data: licenses, error: licenseError } = await supabase
        .from('licenses')
        .select('*, packages(name)') // Vẫn join nhẹ bảng package (thường ít lỗi hơn)

    if (licenseError) {
        console.error('Lỗi lấy Licenses:', JSON.stringify(licenseError, null, 2))
        // Nếu lỗi license thì vẫn trả về user nhưng không có license
    }

    // 3. Ghép 2 mảng lại bằng Javascript (Mapping)
    // Cách này "trâu bò" nhưng cực kỳ an toàn, không sợ lỗi SQL Relation
    const combinedData = profiles.map((user: any) => {
        // Tìm license của user này trong đống licenses vừa lấy
        const userLicense = licenses?.find((lic: any) => lic.user_id === user.id)

        // Format lại cho đúng cấu trúc UI cần
        return {
            ...user,
            licenses: userLicense ? {
                id: userLicense.id,
                status: userLicense.status,
                end_date: userLicense.end_date,
                package_id: userLicense.package_id,
                packages: userLicense.packages // Tên gói
            } : null // Không có license
        }
    })

    return combinedData
}

export async function getPackages() {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase.from('packages').select('*').eq('is_active', true)
    return data || []
}

// Giữ nguyên hàm assignPackage cũ của bạn (nếu đã có)
// ... (Code assignPackage)

// 3. Assign Package (Update/Extend License)
export async function assignPackage(userId: string, packageId: number) {
    const supabase = await createSupabaseServerClient();

    // Fetch package details
    const { data: pkg } = await supabase.from('packages').select('*').eq('id', packageId).single();
    if (!pkg) throw new Error('Package not found');

    // Check for existing license
    const { data: existingLicense } = await supabase
        .from('licenses')
        .select('*')
        .eq('user_id', userId)
        .single();

    // Determine new End Date
    let newEndDate = new Date();

    if (existingLicense) {
        // Extend logic
        const currentEnd = new Date(existingLicense.end_date);
        const now = new Date();

        // If current license is still active, add to the end of it
        // If expired, start fresh from now
        if (currentEnd > now) {
            newEndDate = new Date(currentEnd);
        }

        newEndDate.setDate(newEndDate.getDate() + pkg.duration_days);

        // Update existing
        const { error } = await supabase
            .from('licenses')
            .update({
                package_id: packageId,
                status: 'active',
                end_date: newEndDate.toISOString()
            })
            .eq('id', existingLicense.id);

        if (error) throw new Error(error.message);

    } else {
        // Create New License
        newEndDate.setDate(newEndDate.getDate() + pkg.duration_days);
        const generatedKey = `KEY-${uuidv4().substring(0, 8).toUpperCase()}`;

        const { error } = await supabase.from('licenses').insert({
            user_id: userId,
            package_id: packageId,
            key_code: generatedKey,
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: newEndDate.toISOString(),
        });

        if (error) throw new Error(error.message);
    }

    revalidatePath('/dashboard/admin/users');
    return { success: true };
}