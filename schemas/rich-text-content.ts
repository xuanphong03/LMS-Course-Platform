interface RichTextNode {
    text?: unknown
    content?: unknown
}

function collectText(node: unknown): string {
    if (!node || typeof node !== 'object') return ''

    const richTextNode = node as RichTextNode
    const text = typeof richTextNode.text === 'string' ? richTextNode.text : ''
    const content = Array.isArray(richTextNode.content) ? richTextNode.content : []

    return text + content.map(collectText).join('')
}

/**
 * Đếm ký tự người dùng thực sự nhập, bỏ qua metadata và markup của JSON Tiptap.
 * Vì vậy giá trị JSON vẫn được giữ nguyên để lưu database mà không làm sai giới hạn ký tự.
 */
export function getRichTextCharacterCount(value: string): number {
    if (!value.trim()) return 0

    try {
        return collectText(JSON.parse(value)).trim().length
    } catch {
        // Cho phép schema báo lỗi theo độ dài nếu dữ liệu cũ chưa phải JSON hợp lệ.
        return value.trim().length
    }
}
