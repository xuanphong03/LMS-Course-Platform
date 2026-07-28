'use client'
import { useMemo } from 'react'
import { generateHTML, type JSONContent } from '@tiptap/react'
import { extensions } from '@/components/rich-text-editor/RichTextEditor'
import parse from 'html-react-parser'

export default function RenderTextEditor({ json }: { json: JSONContent }) {
    const output = useMemo(() => {
        return generateHTML(json, extensions)
    }, [json])
    return (
        <div className='prose dark:prose-invert prose-li:marker:text-primary [&_*+ol]:mt-2 [&_*+p]:mt-2 [&_*+ul]:mt-2 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc'>
            {parse(output)}
        </div>
    )
}
