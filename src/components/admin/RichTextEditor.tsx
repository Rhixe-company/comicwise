"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "utils";

interface RichTextEditorProps {
  className?: string;
  disabled?: boolean;
  onChange(value: string): void;
  placeholder?: string;
  value: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder: _placeholder = "Write something...",
  className,
  disabled = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <div className="bg-muted/50 flex flex-wrap gap-1 border-b p-2">
        <Button
          className={cn("size-8 p-0", editor.isActive("bold") && "bg-muted")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          className={cn("size-8 p-0", editor.isActive("italic") && "bg-muted")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          className={cn("size-8 p-0", editor.isActive("code") && "bg-muted")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleCode().run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Code className="size-4" />
        </Button>
        <div className="bg-border w-px" />
        <Button
          className={cn("size-8 p-0", editor.isActive("heading", { level: 2 }) && "bg-muted")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          className={cn("size-8 p-0", editor.isActive("heading", { level: 3 }) && "bg-muted")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Heading3 className="size-4" />
        </Button>
        <div className="bg-border w-px" />
        <Button
          className={cn("size-8 p-0", editor.isActive("bulletList") && "bg-muted")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <List className="size-4" />
        </Button>
        <Button
          className={cn("size-8 p-0", editor.isActive("orderedList") && "bg-muted")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          className={cn("size-8 p-0", editor.isActive("blockquote") && "bg-muted")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Quote className="size-4" />
        </Button>
        <div className="bg-border w-px" />
        <Button
          className="size-8 p-0"
          disabled={!editor.can().undo() || disabled}
          onClick={() => editor.chain().focus().undo().run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Undo className="size-4" />
        </Button>
        <Button
          className="size-8 p-0"
          disabled={!editor.can().redo() || disabled}
          onClick={() => editor.chain().focus().redo().run()}
          size="sm"
          type="button"
          variant="ghost"
        >
          <Redo className="size-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
