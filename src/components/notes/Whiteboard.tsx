/**
 * Whiteboard - Excalidraw integration
 * Interactive drawing canvas for diagrams and sketches
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { AppState } from "@excalidraw/excalidraw/types/types";
import { X, Save, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Note } from "@/types/lifeOS";

interface WhiteboardProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  onClose: () => void;
}

export function Whiteboard({ note, onUpdate, onClose }: WhiteboardProps) {
  const [title, setTitle] = useState(note.title);
  const [isSaving, setIsSaving] = useState(false);
  const excalidrawRef = useRef<any>(null);
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
    if (!excalidrawRef.current) return;
    
    const elements = excalidrawRef.current.getSceneElements();
    const appState = excalidrawRef.current.getAppState();
    
    try {
      const blob = await exportToBlob({
        elements,
        appState,
        files: excalidrawRef.current.getFiles(),
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
    if (excalidrawRef.current) {
      excalidrawRef.current.updateScene({ elements: [] });
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
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Excalidraw Canvas */}
      <div className="flex-1 bg-white dark:bg-zinc-900">
        <Excalidraw
          ref={excalidrawRef}
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