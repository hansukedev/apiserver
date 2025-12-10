'use client' // Dòng này bắt buộc để dùng onClick
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        // Tạo client ở phía trình duyệt
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Đăng xuất
        await supabase.auth.signOut()

        // Refresh lại router để xóa cache và đá về login
        router.refresh()
        router.replace('/login')
    }

    return (
        <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2"
        >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
        </button>
    )
}