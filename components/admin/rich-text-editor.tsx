"use client"

import { useEditor, EditorContent, BubbleMenu, FloatingMenu, mergeAttributes } from "@tiptap/react"
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

// Values match Prism language names, which highlight the public pages.
const CODE_LANGUAGES = [
  { value: "", label: "Plain text" },
  { value: "bash", label: "Bash" },
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
  { value: "tsx", label: "TSX" },
  { value: "javascript", label: "JavaScript" },
  { value: "json", label: "JSON" },
  { value: "sql", label: "SQL" },
  { value: "solidity", label: "Solidity" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "yaml", label: "YAML" },
  { value: "docker", label: "Dockerfile" },
]

// Images with an optional caption, stored as <figure><img><figcaption>. Plain <img> still parses.
const FigureImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: (element) => element.closest("figure")?.querySelector("figcaption")?.textContent || null,
        renderHTML: () => ({}),
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: "figure",
        getAttrs: (node) => {
          const img = (node as HTMLElement).querySelector("img")
          if (!img) return false
          return {
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt"),
            title: img.getAttribute("title"),
            caption: (node as HTMLElement).querySelector("figcaption")?.textContent || null,
          }
        },
      },
      { tag: "img[src]" },
    ]
  },
  renderHTML({ node, HTMLAttributes }) {
    const img: [string, Record<string, unknown>] = ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
    return node.attrs.caption ? ["figure", {}, img, ["figcaption", {}, node.attrs.caption]] : img
  },
})

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  // Storage folder inside the blog-images bucket for uploaded images.
  uploadFolder?: string
  // Shorter editing area, for forms with many editors.
  compact?: boolean
  id?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  uploadFolder = "blog",
  compact = false,
  id,
}: RichTextEditorProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [imageCaption, setImageCaption] = useState("")
  const [editingImage, setEditingImage] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      FigureImage.configure({
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
          cn(
            "prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none p-4 bg-background text-foreground rounded-lg border",
            "prose-figcaption:text-center prose-figcaption:text-sm",
            compact ? "min-h-[160px]" : "min-h-[300px]",
          ),
        ...(id ? { id } : {}),
      },
    },
  })

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createBrowserSupabaseClient()
      const fileExt = file.name.split(".").pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${uploadFolder}/${fileName}`

      const { error: uploadError } = await supabase.storage.from("blog-images").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath)

      setImageUrl(publicUrl)
      toast({
        title: "Image uploaded",
        description: "Add alt text, then insert it.",
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

  // Opens the image dialog, prefilled when an image is selected so its details can be edited.
  const openImageDialog = () => {
    const selected = editor?.isActive("image")
    const attrs = selected ? editor!.getAttributes("image") : {}
    setEditingImage(Boolean(selected))
    setImageUrl(attrs.src ?? "")
    setImageAlt(attrs.alt ?? "")
    setImageCaption(attrs.caption ?? "")
    setShowImageDialog(true)
  }

  const saveImage = () => {
    if (!imageUrl || !imageAlt.trim()) return
    const attrs = { src: imageUrl, alt: imageAlt.trim(), caption: imageCaption.trim() || null }
    if (editingImage) {
      editor?.chain().focus().updateAttributes("image", attrs).run()
    } else {
      editor?.chain().focus().insertContent({ type: "image", attrs }).run()
    }
    setImageUrl("")
    setImageAlt("")
    setImageCaption("")
    setShowImageDialog(false)
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

        {editor.isActive("codeBlock") && (
          <select
            aria-label="Code language"
            className="h-8 rounded-md border bg-background px-2 text-sm"
            value={editor.getAttributes("codeBlock").language ?? ""}
            onChange={(e) =>
              editor.chain().focus().updateAttributes("codeBlock", { language: e.target.value || null }).run()
            }
          >
            {CODE_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        )}

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

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", editor.isActive("image") && "bg-muted")}
          onClick={openImageDialog}
          aria-label={editor.isActive("image") ? "Edit image details" : "Insert image"}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingImage ? "Edit image" : "Add image"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {!editingImage && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="rte-image-file">Upload image</Label>
                    <Input
                      id="rte-image-file"
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
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="rte-image-url">Image URL</Label>
                <Input
                  id="rte-image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className="max-h-40 rounded-md border object-contain" />
              )}
              <div className="space-y-2">
                <Label htmlFor="rte-image-alt">Alt text (required)</Label>
                <Input
                  id="rte-image-alt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="What the image shows, for screen readers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rte-image-caption">Caption (optional)</Label>
                <Input
                  id="rte-image-caption"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Shown under the image"
                />
              </div>
              <Button type="button" onClick={saveImage} disabled={!imageUrl || !imageAlt.trim() || uploading}>
                {uploading ? "Uploading..." : editingImage ? "Update image" : "Insert image"}
              </Button>
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
            onClick={openImageDialog}
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
