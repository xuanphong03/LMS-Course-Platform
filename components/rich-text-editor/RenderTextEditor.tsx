'use client'
import { useMemo } from 'react'
import { generateHTML, type JSONContent } from '@tiptap/react'
import { extensions } from '@/components/rich-text-editor/RichTextEditor'
import parse from 'html-react-parser'

import '@/components/rich-text-editor/styles.css'

export default function RenderTextEditor({ json }: { json: JSONContent }) {
    const output = useMemo(() => {
        return generateHTML(json, extensions)
    }, [json])
    return <div className='tiptap prose dark:prose-invert prose-li:marker:text-primary'>{parse(output)}</div>
}
