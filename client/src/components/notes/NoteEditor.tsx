/**
 * NoteEditor - Notion-style rich text editor
 * Uses TipTap for a powerful editing experience with markdown shortcuts
 */

import { useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Typography from "@tiptap/extension-typography";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Quote,
  Minus,
  CheckSquare,
  X,
  Tag as TagIcon,
  Save,
  Keyboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Note, NoteTag } from "@/types/lifeOS";
import { cn } from "@/lib/utils";

interface NoteEditorProps {
  note: Note;
  availableTags: NoteTag[];
  onUpdate: (updates: Partial<Note>) => void;
  onClose: () => void;
}

export function NoteEditor({ note, availableTags, onUpdate, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [selectedTags, setSelectedTags] = useState<string[]>(note.tags);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder: "Escribe algo... Usa # para títulos, - para listas, [] para tareas"
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Typography, // Adds smart typography shortcuts
    ],
    content: note.content || "<p></p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-2"
      },
      handleKeyDown: (view, event) => {
        // Handle markdown-style shortcuts at the start of a line
        const { state } = view;
        const { selection } = state;
        const { $from } = selection;
        const lineStart = $from.start();
        const textBefore = state.doc.textBetween(lineStart, $from.pos, "\n", "\n");
        
        if (event.key === " " && !event.shiftKey) {
          // # + space = Heading 1
          if (textBefore === "#") {
            event.preventDefault();
            view.dispatch(state.tr.delete(lineStart, $from.pos));
            editor?.chain().focus().toggleHeading({ level: 1 }).run();
            return true;
          }
          // ## + space = Heading 2
          if (textBefore === "##") {
            event.preventDefault();
            view.dispatch(state.tr.delete(lineStart, $from.pos));
            editor?.chain().focus().toggleHeading({ level: 2 }).run();
            return true;
          }
          // ### + space = Heading 3
          if (textBefore === "###") {
            event.preventDefault();
            view.dispatch(state.tr.delete(lineStart, $from.pos));
            editor?.chain().focus().toggleHeading({ level: 3 }).run();
            return true;
          }
          // - + space = Bullet list
          if (textBefore === "-" || textBefore === "*") {
            event.preventDefault();
            view.dispatch(state.tr.delete(lineStart, $from.pos));
            editor?.chain().focus().toggleBulletList().run();
            return true;
          }
          // 1. + space = Ordered list
          if (/^\d+\.$/.test(textBefore)) {
            event.preventDefault();
            view.dispatch(state.tr.delete(lineStart, $from.pos));
            editor?.chain().focus().toggleOrderedList().run();
            return true;
          }
          // [] + space = Task list
          if (textBefore === "[]" || textBefore === "[ ]") {
            event.preventDefault();
            view.dispatch(state.tr.delete(lineStart, $from.pos));
            editor?.chain().focus().toggleTaskList().run();
            return true;
          }
          // > + space = Blockquote
          if (textBefore === ">") {
            event.preventDefault();
            view.dispatch(state.tr.delete(lineStart, $from.pos));
            editor?.chain().focus().toggleBlockquote().run();
            return true;
          }
          // ``` + space = Code block
          if (textBefore === "```") {
            event.preventDefault();
            view.dispatch(state.tr.delete(lineStart, $from.pos));
            editor?.chain().focus().toggleCodeBlock().run();
            return true;
          }
          // --- = Horizontal rule
          if (textBefore === "---") {
            event.preventDefault();
            view.dispatch(state.tr.delete(lineStart, $from.pos));
            editor?.chain().focus().setHorizontalRule().run();
            return true;
          }
        }
        return false;
      }
    },
    onUpdate: ({ editor }) => {
      // Auto-save debounced
      handleAutoSave(editor.getHTML());
    }
  });

  // Debounced auto-save
  const handleAutoSave = useCallback(
    debounce((content: string) => {
      setIsSaving(true);
      onUpdate({ content });
      setTimeout(() => setIsSaving(false), 500);
    }, 1000),
    [onUpdate]
  );

  // Update title
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (title !== note.title) {
        onUpdate({ title });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [title, note.title, onUpdate]);

  // Update tags
  useEffect(() => {
    if (JSON.stringify(selectedTags) !== JSON.stringify(note.tags)) {
      onUpdate({ tags: selectedTags });
    }
  }, [selectedTags, note.tags, onUpdate]);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-card/50">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-0"
          placeholder="Título del apunte"
        />
        
        <div className="flex items-center gap-1">
          {isSaving && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Save className="w-3 h-3" />
              Guardando...
            </span>
          )}
          
          <Popover open={showTagPicker} onOpenChange={setShowTagPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <TagIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Etiquetas</h4>
                <ScrollArea className="h-48">
                  <div className="space-y-1">
                    {availableTags.map(tag => (
                      <div
                        key={tag.id}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors",
                          selectedTags.includes(tag.id)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        )}
                        onClick={() => toggleTag(tag.id)}
                      >
                        <div className={cn("w-2 h-2 rounded-full", tag.color)} />
                        <span className="text-sm flex-1">{tag.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {tag.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 px-4 py-2 border-b border-border bg-muted/30">
          {selectedTags.map(tagId => {
            const tag = availableTags.find(t => t.id === tagId);
            if (!tag) return null;
            return (
              <Badge 
                key={tagId} 
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleTag(tagId)}
              >
                {tag.name}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30 overflow-x-auto">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          icon={<Heading1 className="w-4 h-4" />}
          title="Título 1 (# + espacio)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          icon={<Heading2 className="w-4 h-4" />}
          title="Título 2 (## + espacio)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          icon={<Heading3 className="w-4 h-4" />}
          title="Título 3 (### + espacio)"
        />
        
        <div className="w-px h-5 bg-border mx-1" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={<Bold className="w-4 h-4" />}
          title="Negrita (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={<Italic className="w-4 h-4" />}
          title="Cursiva (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          icon={<Strikethrough className="w-4 h-4" />}
          title="Tachado (Ctrl+Shift+X)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          icon={<Code className="w-4 h-4" />}
          title="Código (Ctrl+E)"
        />
        
        <div className="w-px h-5 bg-border mx-1" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={<List className="w-4 h-4" />}
          title="Lista (- + espacio)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={<ListOrdered className="w-4 h-4" />}
          title="Lista numerada (1. + espacio)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          isActive={editor.isActive("taskList")}
          icon={<CheckSquare className="w-4 h-4" />}
          title="Tareas ([] + espacio)"
        />
        
        <div className="w-px h-5 bg-border mx-1" />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          icon={<Quote className="w-4 h-4" />}
          title="Cita (> + espacio)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          icon={<Minus className="w-4 h-4" />}
          title="Línea horizontal (--- + espacio)"
        />
        
        <div className="w-px h-5 bg-border mx-1" />
        
        {/* Keyboard shortcuts help */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded transition-colors hover:bg-muted text-muted-foreground hover:text-foreground">
              <Keyboard className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="text-xs space-y-1">
              <p className="font-semibold mb-2">Atajos de teclado:</p>
              <p><kbd className="bg-muted px-1 rounded">#</kbd> + espacio = Título 1</p>
              <p><kbd className="bg-muted px-1 rounded">##</kbd> + espacio = Título 2</p>
              <p><kbd className="bg-muted px-1 rounded">###</kbd> + espacio = Título 3</p>
              <p><kbd className="bg-muted px-1 rounded">-</kbd> + espacio = Lista</p>
              <p><kbd className="bg-muted px-1 rounded">1.</kbd> + espacio = Lista numerada</p>
              <p><kbd className="bg-muted px-1 rounded">[]</kbd> + espacio = Tarea</p>
              <p><kbd className="bg-muted px-1 rounded">&gt;</kbd> + espacio = Cita</p>
              <p><kbd className="bg-muted px-1 rounded">---</kbd> = Línea</p>
              <p><kbd className="bg-muted px-1 rounded">Ctrl+B</kbd> = Negrita</p>
              <p><kbd className="bg-muted px-1 rounded">Ctrl+I</kbd> = Cursiva</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Editor */}
      <ScrollArea className="flex-1">
        <EditorContent editor={editor} className="min-h-full" />
      </ScrollArea>

      {/* Bubble Menu */}
      {editor && (
        <BubbleMenu editor={editor} className="flex items-center gap-0.5 p-1 rounded-lg bg-popover border border-border shadow-lg">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold className="w-3 h-3" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic className="w-3 h-3" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={<Strikethrough className="w-3 h-3" />}
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            icon={<Code className="w-3 h-3" />}
          />
        </BubbleMenu>
      )}
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  title?: string;
}

function ToolbarButton({ onClick, isActive, icon, title }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "p-1.5 rounded transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
    </button>
  );
}

// Debounce helper
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}