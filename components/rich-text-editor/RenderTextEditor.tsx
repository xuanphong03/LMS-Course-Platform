'use client'
import { useMemo } from 'react'
import { type JSONContent } from '@tiptap/core'
import { extensions } from '@/components/rich-text-editor/extensions'
import parse from 'html-react-parser'
import { generateHTML } from '@tiptap/html'
import '@/components/rich-text-editor/styles.css'

/**
 * Render nội dung Tiptap ở client vì generateHTML cần DOM API để serialize JSON thành HTML.
 */
export default function RenderTextEditor({ json }: { json: JSONContent }) {
    const output = useMemo(() => {
        return generateHTML(json, extensions)
    }, [json])
    return <div className='tiptap prose dark:prose-invert prose-li:marker:text-primary'>{parse(output)}</div>
}
