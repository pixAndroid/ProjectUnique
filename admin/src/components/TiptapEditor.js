'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import {
  FaBold, FaItalic, FaListUl, FaListOl, FaQuoteLeft,
  FaUndo, FaRedo, FaLink, FaImage, FaHeading
} from 'react-icons/fa';

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false })
    ],
    content: content || '',
    editorProps: {
      attributes: {
        class: 'min-h-64 p-4 text-slate-200 focus:outline-none prose prose-invert max-w-none'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) return null;

  const btn = (action, icon, title, active) => (
    <button
      type="button"
      onClick={action}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-600'
      }`}
    >
      {icon}
    </button>
  );

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = prompt('Enter URL:');
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="bg-slate-800">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-slate-600 bg-slate-750">
        {btn(() => editor.chain().focus().toggleBold().run(), <FaBold />, 'Bold', editor.isActive('bold'))}
        {btn(() => editor.chain().focus().toggleItalic().run(), <FaItalic />, 'Italic', editor.isActive('italic'))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), <FaHeading />, 'Heading 2', editor.isActive('heading', { level: 2 }))}
        {btn(() => editor.chain().focus().toggleBulletList().run(), <FaListUl />, 'Bullet List', editor.isActive('bulletList'))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), <FaListOl />, 'Numbered List', editor.isActive('orderedList'))}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), <FaQuoteLeft />, 'Blockquote', editor.isActive('blockquote'))}
        <div className="w-px h-5 bg-slate-600 mx-1 self-center" />
        {btn(setLink, <FaLink />, 'Add Link', editor.isActive('link'))}
        {btn(addImage, <FaImage />, 'Add Image', false)}
        <div className="w-px h-5 bg-slate-600 mx-1 self-center" />
        {btn(() => editor.chain().focus().undo().run(), <FaUndo />, 'Undo', false)}
        {btn(() => editor.chain().focus().redo().run(), <FaRedo />, 'Redo', false)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
