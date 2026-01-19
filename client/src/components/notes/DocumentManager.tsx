/**
 * DocumentManager - File upload and management for notes
 * Stores documents in localStorage as base64
 */

import { useState, useRef } from "react";
import { 
  Upload, 
  File, 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  Trash2, 
  Download, 
  X,
  Eye,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Note, NoteDocument } from "@/types/lifeOS";
import { cn } from "@/lib/utils";

interface DocumentManagerProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  onClose: () => void;
}

export function DocumentManager({ note, onUpdate, onClose }: DocumentManagerProps) {
  const { state, addNoteDocument, deleteNoteDocument } = useLifeOSContext();
  const [title, setTitle] = useState(note.title);
  const [previewDoc, setPreviewDoc] = useState<NoteDocument | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get documents for this note
  const documents = state.noteDocuments.filter(d => d.noteId === note.id);

  // Update title
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdate({ title: newTitle });
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        addNoteDocument({
          noteId: note.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          dataUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Get icon for file type
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="w-8 h-8 text-blue-500" />;
    if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) {
      return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
    }
    if (type.includes("pdf")) return <FileText className="w-8 h-8 text-red-500" />;
    return <File className="w-8 h-8 text-muted-foreground" />;
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Download file
  const handleDownload = (doc: NoteDocument) => {
    const a = document.createElement("a");
    a.href = doc.dataUrl;
    a.download = doc.fileName;
    a.click();
  };

  // Can preview
  const canPreview = (type: string) => {
    return type.startsWith("image/") || type === "application/pdf";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-card/50">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 px-0 flex-1"
          placeholder="Título de documentos"
        />
        
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "m-4 p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Arrastra archivos aquí</p>
            <p className="text-sm text-muted-foreground">o haz clic para seleccionar</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Imágenes, PDF, Excel y otros documentos
          </p>
        </div>
      </div>

      {/* Documents List */}
      <div className="flex-1 px-4 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Documentos ({documents.length})
          </span>
        </div>
        
        <ScrollArea className="h-[calc(100%-28px)]">
          {documents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay documentos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                >
                  {/* Thumbnail or Icon */}
                  {doc.fileType.startsWith("image/") ? (
                    <img
                      src={doc.dataUrl}
                      alt={doc.fileName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      {getFileIcon(doc.fileType)}
                    </div>
                  )}
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.fileName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {doc.fileType.split("/")[1]?.toUpperCase() || "FILE"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatSize(doc.fileSize)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canPreview(doc.fileType) && (
                        <DropdownMenuItem onClick={() => setPreviewDoc(doc)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Vista previa
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDownload(doc)}>
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => deleteNoteDocument(doc.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewDoc?.fileName}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {previewDoc?.fileType.startsWith("image/") && (
              <img
                src={previewDoc.dataUrl}
                alt={previewDoc.fileName}
                className="max-w-full h-auto rounded-lg"
              />
            )}
            {previewDoc?.fileType === "application/pdf" && (
              <iframe
                src={previewDoc.dataUrl}
                className="w-full h-[70vh] rounded-lg"
                title={previewDoc.fileName}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}