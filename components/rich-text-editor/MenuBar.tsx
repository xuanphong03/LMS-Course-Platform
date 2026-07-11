'use client'

import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { defaultMenuBarState, menuBarStateSelector } from '@/components/rich-text-editor/menuBarState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Toggle } from '@/components/ui/toggle'
import {
    BoldIcon,
    CaseSensitiveIcon,
    CodeIcon,
    Heading1Icon,
    Heading2Icon,
    Heading3Icon,
    Heading4Icon,
    Heading5Icon,
    Heading6Icon,
    ItalicIcon,
    ListIcon,
    ListOrderedIcon,
    RedoIcon,
    Strikethrough,
    TextAlignCenterIcon,
    TextAlignEndIcon,
    TextAlignStartIcon,
    UndoIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ComponentProps, ReactNode } from 'react'

interface MenuBarProps {
    editor: Editor | null
}

interface ToolbarToggleProps extends ComponentProps<typeof Toggle> {
    tooltip: string
    children: ReactNode
}

function ToolbarToggle({ tooltip, children, ...props }: ToolbarToggleProps) {
    return (
        <Tooltip>
            <TooltipTrigger render={<Toggle {...props} />}>{children}</TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    )
}

export default function MenuBar({ editor }: MenuBarProps) {
    const editorState =
        useEditorState({
            editor,
            selector: menuBarStateSelector,
        }) ?? defaultMenuBarState

    if (!editor) {
        return null
    }

    return (
        <div className='border-input bg-card flex flex-wrap items-center gap-1 rounded-t-[inherit] border-b p-2'>
            <TooltipProvider>
                <div className='flex flex-wrap items-center gap-1'>
                    <ToolbarToggle
                        tooltip='Bold'
                        size='sm'
                        pressed={editorState.isBold}
                        disabled={!editorState.canBold}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    >
                        <BoldIcon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Italic'
                        size='sm'
                        pressed={editorState.isItalic}
                        disabled={!editorState.canItalic}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    >
                        <ItalicIcon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Strike'
                        size='sm'
                        pressed={editorState.isStrike}
                        disabled={!editorState.canStrike}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    >
                        <Strikethrough />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Code'
                        size='sm'
                        pressed={editorState.isCode}
                        disabled={!editorState.canCode}
                        onPressedChange={() => editor.chain().focus().toggleCode().run()}
                    >
                        <CodeIcon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Paragraph'
                        size='sm'
                        pressed={editorState.isParagraph}
                        onPressedChange={() => editor.chain().focus().setParagraph().run()}
                    >
                        <CaseSensitiveIcon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Heading 1'
                        size='sm'
                        pressed={editorState.isHeading1}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    >
                        <Heading1Icon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Heading 2'
                        size='sm'
                        pressed={editorState.isHeading2}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    >
                        <Heading2Icon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Heading 3'
                        size='sm'
                        pressed={editorState.isHeading3}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    >
                        <Heading3Icon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Heading 4'
                        size='sm'
                        pressed={editorState.isHeading4}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    >
                        <Heading4Icon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Heading 5'
                        size='sm'
                        pressed={editorState.isHeading5}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                    >
                        <Heading5Icon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Heading 6'
                        size='sm'
                        pressed={editorState.isHeading6}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                    >
                        <Heading6Icon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Bullet list'
                        size='sm'
                        pressed={editorState.isBulletList}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    >
                        <ListIcon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Ordered list'
                        size='sm'
                        pressed={editorState.isOrderedList}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    >
                        <ListOrderedIcon />
                    </ToolbarToggle>
                </div>
                <div className='bg-border mx-2 h-6 w-px'></div>
                <div className='flex flex-wrap items-center gap-1'>
                    <ToolbarToggle
                        tooltip='Text align left'
                        size='sm'
                        pressed={editor.isActive({ textAlign: 'left' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                        className={cn(editor.isActive({ textAlign: 'left' }) && 'bg-muted text-muted-foreground')}
                    >
                        <TextAlignStartIcon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Text align center'
                        size='sm'
                        pressed={editor.isActive({ textAlign: 'center' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                        className={cn(editor.isActive({ textAlign: 'center' }) && 'bg-muted text-muted-foreground')}
                    >
                        <TextAlignCenterIcon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Text align right'
                        size='sm'
                        pressed={editor.isActive({ textAlign: 'right' })}
                        onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                        className={cn(editor.isActive({ textAlign: 'right' }) && 'bg-muted text-muted-foreground')}
                    >
                        <TextAlignEndIcon />
                    </ToolbarToggle>
                </div>
                <div className='bg-border mx-2 h-6 w-px'></div>
                <div className='flex flex-wrap items-center gap-1'>
                    <ToolbarToggle
                        tooltip='Undo'
                        size='sm'
                        disabled={!editorState.canUndo}
                        onPressedChange={() => editor.chain().focus().undo().run()}
                    >
                        <UndoIcon />
                    </ToolbarToggle>
                    <ToolbarToggle
                        tooltip='Redo'
                        size='sm'
                        disabled={!editorState.canRedo}
                        onPressedChange={() => editor.chain().focus().redo().run()}
                    >
                        <RedoIcon />
                    </ToolbarToggle>
                </div>
            </TooltipProvider>
        </div>
    )
}
