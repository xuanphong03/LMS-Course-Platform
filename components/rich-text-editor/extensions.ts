import { TextStyleKit } from '@tiptap/extension-text-style'
import { TextAlign } from '@tiptap/extension-text-align'
import StarterKit from '@tiptap/starter-kit'

// Dùng chung schema giữa editor và renderer nhưng không kéo theo useEditor vào server render.
export const extensions = [TextStyleKit, StarterKit, TextAlign.configure({ types: ['heading', 'paragraph'] })]
