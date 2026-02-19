"use client"

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import { common, createLowlight } from "lowlight"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  LinkIcon,
  Code2,
  Table as TableIcon,
  Trash2,
  Columns,
  Rows,
  Split,
  Merge,
  Heading1,
  Heading2,
  Heading3,
  Check,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const lowlight = createLowlight(common)

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-muted rounded-lg p-4 font-mono text-sm my-4",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4 bg-background rounded-lg border",
      },
    },
  })

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `blog/${fileName}`

      const { error: uploadError } = await supabase.storage.from("blog-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath)

      editor?.chain().focus().setImage({ src: publicUrl }).run()
      setShowImageDialog(false)

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const addImageFromUrl = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
      setShowImageDialog(false)
    }
  }

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl("")
      setShowLinkDialog(false)
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="space-y-2">
      {/* Menu Bar (Fixed Toolbar) */}
      <div className="flex flex-wrap items-center gap-1 p-2 border rounded-lg bg-muted/50 sticky top-0 z-10">

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Style Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 min-w-[100px] justify-between">
              <span className="truncate">
                {editor.isActive('heading', { level: 1 }) ? 'Heading 1' :
                  editor.isActive('heading', { level: 2 }) ? 'Heading 2' :
                    editor.isActive('heading', { level: 3 }) ? 'Heading 3' :
                      editor.isActive('codeBlock') ? 'Code Block' :
                        'Paragraph'}
              </span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
              <span className="flex-1">Paragraph</span>
              {editor.isActive('paragraph') && <Check className="h-3 w-3 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <span className="flex-1">Heading 1</span>
              {editor.isActive('heading', { level: 1 }) && <Check className="h-3 w-3 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <span className="flex-1">Heading 2</span>
              {editor.isActive('heading', { level: 2 }) && <Check className="h-3 w-3 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <span className="flex-1">Heading 3</span>
              {editor.isActive('heading', { level: 3 }) && <Check className="h-3 w-3 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
              <span className="flex-1">Code Block</span>
              {editor.isActive('codeBlock') && <Check className="h-3 w-3 ml-2" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Basic Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-muted")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-muted")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("strike") && "bg-muted")}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("code") && "bg-muted")}
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Lists & Quotes */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-muted")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("orderedList") && "bg-muted")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn("h-8 w-8 p-0", editor.isActive("blockquote") && "bg-muted")}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Insert Actions (Table, Link, Image) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn("h-8 w-8 p-0", editor.isActive("table") && "bg-muted")}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start">
            <div className="grid grid-cols-1 gap-1">
              <span className="text-xs font-medium text-muted-foreground px-2 py-1">Insert</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              >
                <TableIcon className="mr-2 h-4 w-4" />
                Insert Table
              </Button>
              <div className="h-px bg-border my-1" />
              <span className="text-xs font-medium text-muted-foreground px-2 py-1">Row</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                disabled={!editor.can().addRowBefore()}
              >
                <Rows className="mr-2 h-4 w-4 rotate-180" />
                Add Row Before
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                disabled={!editor.can().addRowAfter()}
              >
                <Rows className="mr-2 h-4 w-4" />
                Add Row After
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full text-destructive hover:text-destructive"
                onClick={() => editor.chain().focus().deleteRow().run()}
                disabled={!editor.can().deleteRow()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Row
              </Button>
              <div className="h-px bg-border my-1" />
              <span className="text-xs font-medium text-muted-foreground px-2 py-1">Column</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                disabled={!editor.can().addColumnBefore()}
              >
                <Columns className="mr-2 h-4 w-4 rotate-180" />
                Add Column Before
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                disabled={!editor.can().addColumnAfter()}
              >
                <Columns className="mr-2 h-4 w-4" />
                Add Column After
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full text-destructive hover:text-destructive"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                disabled={!editor.can().deleteColumn()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Column
              </Button>
              <div className="h-px bg-border my-1" />
              <span className="text-xs font-medium text-muted-foreground px-2 py-1">Cell</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full"
                onClick={() => editor.chain().focus().mergeCells().run()}
                disabled={!editor.can().mergeCells()}
              >
                <Merge className="mr-2 h-4 w-4" />
                Merge Cells
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full"
                onClick={() => editor.chain().focus().splitCell().run()}
                disabled={!editor.can().splitCell()}
              >
                <Split className="mr-2 h-4 w-4" />
                Split Cell
              </Button>
              <div className="h-px bg-border my-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="justify-start h-8 px-2 w-full text-destructive hover:text-destructive"
                onClick={() => editor.chain().focus().deleteTable().run()}
                disabled={!editor.can().deleteTable()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Table
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  disabled={uploading}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button type="button" onClick={addImageFromUrl} disabled={!imageUrl}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-muted")}>
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                  <Button type="button" onClick={addLink} disabled={!linkUrl}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 p-1 bg-background border rounded-lg shadow-md"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("h-8 w-8 p-0", editor.isActive("bold") && "bg-muted")}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("h-8 w-8 p-0", editor.isActive("italic") && "bg-muted")}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn("h-8 w-8 p-0", editor.isActive("strike") && "bg-muted")}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn("h-8 w-8 p-0", editor.isActive("code") && "bg-muted")}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowLinkDialog(true)}
            className={cn("h-8 w-8 p-0", editor.isActive("link") && "bg-muted")}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </BubbleMenu>
      )}

      {/* Floating Menu */}
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex items-center gap-1 p-1 bg-background border rounded-lg shadow-md"
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 1 }) && "bg-muted")}
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn("h-8 w-8 p-0", editor.isActive("heading", { level: 2 }) && "bg-muted")}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn("h-8 w-8 p-0", editor.isActive("bulletList") && "bg-muted")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className={cn("h-8 w-8 p-0")}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageDialog(true)}
            className={cn("h-8 w-8 p-0")}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </FloatingMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
