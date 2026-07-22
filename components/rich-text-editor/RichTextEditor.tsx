'use client'

import MenuBar from '@/components/rich-text-editor/MenuBar'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { TextAlign } from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import '@/components/rich-text-editor/styles.css'
import type { Editor } from '@tiptap/core'
import { useEffect } from 'react'

interface RichTextEditorProps {
    id?: string
    name?: string
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    invalid?: boolean
    placeholder?: string
}

const extensions = [TextStyleKit, StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })]

function getEditorFormValue(editor: Editor) {
    return editor.getText().trim() ? editor.getHTML() : ''
}

export default function RichTextEditor({
    id,
    name,
    value,
    onChange,
    onBlur,
    invalid = false,
    placeholder,
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions,
        immediatelyRender: false,
        content: value || '',
        editorProps: {
            attributes: {
                ...(id ? { id } : {}),
                class: 'min-h-80 focus:outline-none p-2',
                'aria-invalid': invalid ? 'true' : 'false',
                ...(placeholder ? { placeholder } : {}),
            },
        },
        onBlur: () => {
            onBlur?.()
        },
        onUpdate: ({ editor }) => {
            onChange(getEditorFormValue(editor))
        },
    })

    useEffect(() => {
        if (!editor) return

        const editorValue = getEditorFormValue(editor)

        if (value !== editorValue) {
            editor.commands.setContent(value || '', { emitUpdate: false })
        }
    }, [editor, value])

    return (
        <div
            tabIndex={-1}
            data-invalid={invalid}
            className='border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20 w-full min-w-0 overflow-hidden rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[invalid=true]:ring-3 md:text-sm'
        >
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}
