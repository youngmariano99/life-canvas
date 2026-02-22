/**
 * Whiteboard - Excalidraw integration
 * Interactive drawing canvas for diagrams and sketches
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type { AppState, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";
import { X, Save, Download, Trash2, Maximize, Minimize, Tag as TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Note, NoteTag } from "@/types/lifeOS";

interface WhiteboardProps {
  note: Note;
  availableTags: NoteTag[];
  onUpdate: (updates: Partial<Note>) => void;
  onClose: () => void;
  isFullscreen?: boolean;
  toggleFullscreen?: () => void;
}

export function Whiteboard({ note, availableTags, onUpdate, onClose, isFullscreen, toggleFullscreen }: WhiteboardProps) {
  const [title, setTitle] = useState(note.title);
  const [selectedTags, setSelectedTags] = useState<string[]>(note.tags || []);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [initialData, setInitialData] = useState<{
    elements: ExcalidrawElement[];
    appState?: Partial<AppState>;
  } | null>(null);

  // Parse initial content
  useEffect(() => {
    try {
      if (note.content) {
        const parsed = JSON.parse(note.content);
        setInitialData({
          elements: parsed.elements || [],
          appState: parsed.appState || {}
        });
      } else {
        setInitialData({ elements: [], appState: {} });
      }
    } catch {
      setInitialData({ elements: [], appState: {} });
    }
  }, [note.id]); // Only on note change

  // Update title
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (title !== note.title) {
        onUpdate({ title });
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [title, note.title, onUpdate]);

  // Update tags debounce
  useEffect(() => {
    // Only update if tags actually changed
    const currentTags = note.tags || [];
    if (JSON.stringify(currentTags) !== JSON.stringify(selectedTags)) {
      const timeout = setTimeout(() => {
        onUpdate({ tags: selectedTags });
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [selectedTags, note.tags, onUpdate]);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  // Save canvas data
  const handleSave = useCallback((elements: readonly ExcalidrawElement[], appState: AppState) => {
    setIsSaving(true);
    const data = JSON.stringify({
      elements,
      appState: {
        viewBackgroundColor: appState.viewBackgroundColor,
        zoom: appState.zoom,
        scrollX: appState.scrollX,
        scrollY: appState.scrollY
      }
    });
    onUpdate({ content: data });
    setTimeout(() => setIsSaving(false), 500);
  }, [onUpdate]);

  // Debounced onChange
  const handleChange = useCallback(
    debounce((elements: readonly ExcalidrawElement[], appState: AppState) => {
      handleSave(elements, appState);
    }, 1000),
    [handleSave]
  );

  // Export as PNG
  const handleExport = async () => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();

    try {
      const blob = await exportToBlob({
        elements,
        appState,
        files: excalidrawAPI.getFiles(),
        getDimensions: () => ({ width: 1920, height: 1080, scale: 2 })
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "pizarra"}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting:", error);
    }
  };

  // Clear canvas
  const handleClear = () => {
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({ elements: [] });
      onUpdate({ content: JSON.stringify({ elements: [], appState: {} }) });
    }
  };

  if (!initialData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando pizarra...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-card/50">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-0 flex-1"
          placeholder="Título de la pizarra"
        />

        <div className="flex items-center gap-1">
          <Popover open={showTagPicker} onOpenChange={setShowTagPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" title="Etiquetas" className={selectedTags.length > 0 ? "text-primary" : ""}>
                <TagIcon className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <h4 className="font-semibold mb-2 text-sm">Etiquetas</h4>
              <div className="flex items-center flex-wrap gap-1.5 max-h-48 overflow-y-auto">
                {availableTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {availableTags.length === 0 && (
                  <p className="text-xs text-muted-foreground">No hay etiquetas disponibles</p>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {isSaving && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Save className="w-3 h-3" />
              Guardando...
            </span>
          )}

          <Button variant="ghost" size="icon" onClick={handleExport} title="Exportar PNG">
            <Download className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleClear} title="Limpiar">
            <Trash2 className="w-4 h-4" />
          </Button>

          {toggleFullscreen && (
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} title={isFullscreen ? "Minimizar" : "Pantalla completa"}>
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
          )}

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

      {/* Excalidraw Canvas */}
      <div className="flex-1 bg-white dark:bg-zinc-900">
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          initialData={initialData}
          onChange={handleChange}
          theme="light"
          langCode="es-ES"
          UIOptions={{
            canvasActions: {
              changeViewBackgroundColor: true,
              clearCanvas: false,
              export: false,
              loadScene: false,
              saveAsImage: false,
              saveToActiveFile: false
            }
          }}
        />
      </div>
    </div>
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