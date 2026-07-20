import { env } from '@/lib/env'

export function useConstruct(fileKey: string) {
    if (!fileKey) return
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.tigrisfiles.io/${fileKey}`
}
