'use client'

import { useMemo } from 'react'

interface UseUserInitialOptions {
    name?: string | null
    email?: string | null
}

/**
 * Lấy chữ cái đại diện ổn định cho avatar người dùng.
 *
 * Ưu tiên tên hiển thị; khi tài khoản email chưa có tên, dùng phần đứng trước
 * dấu `@` để avatar vẫn có nội dung thay vì bị bỏ trống.
 */
export default function useUserInitial({ name, email }: UseUserInitialOptions): string {
    return useMemo(() => {
        const displayName = name?.trim() || email?.split('@')[0]?.trim() || ''
        return displayName.charAt(0).toUpperCase() || '?'
    }, [email, name])
}
