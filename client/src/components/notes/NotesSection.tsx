/**
 * Notes Section - Main container for notes management
 * Folder tree navigation + content area
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderPlus,
  Plus,
  Search,
  FileText,
  PenTool,
  FileImage,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Folder,
  FolderOpen,
  MoreVertical,
  Trash2,
  Edit2,
  Pin,
  Tag as TagIcon,
  X,
  Filter,
  Users,
  Archive,
  FolderKanban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { NoteFolder, Note, NoteTag } from "@/types/lifeOS";
import { NoteEditor } from "./NoteEditor";
import { Whiteboard } from "./Whiteboard";
import { DocumentManager } from "./DocumentManager";
import { cn } from "@/lib/utils";

export function NotesSection() {
  const {
    state,
    addNoteFolder,
    updateNoteFolder,
    deleteNoteFolder,
    addNote,
    updateNote,
    deleteNote,
    addNoteTag,
    deleteNoteTag,
    getRoleById
  } = useLifeOSContext();

  // P.A.R.A Navigation State
  const [selectedParaType, setSelectedParaType] = useState<"project" | "role" | "folder" | "archive" | "all">("all");
  const [selectedParaId, setSelectedParaId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get current note
  const selectedNote = useMemo(() => {
    return state.notes.find(n => n.id === selectedNoteId) || null;
  }, [state.notes, selectedNoteId]);

  // Build folder tree structure
  const folderTree = useMemo(() => {
    const rootFolders = state.noteFolders.filter(f => f.parentId === null);

    const buildTree = (parentId: string | null): (NoteFolder & { children: any[] })[] => {
      return state.noteFolders
        .filter(f => f.parentId === parentId)
        .map(folder => ({
          ...folder,
          children: buildTree(folder.id)
        }));
    };

    return buildTree(null);
  }, [state.noteFolders]);

  // Filter notes by P.A.R.A and search
  const filteredNotes = useMemo(() => {
    let notes = state.notes;

    if (selectedParaType === "folder" && selectedParaId) {
      notes = notes.filter(n => n.folderId === selectedParaId && !n.tags?.includes("system-archive"));
    } else if (selectedParaType === "project" && selectedParaId) {
      notes = notes.filter(n => n.tags?.includes(`project-${selectedParaId}`) && !n.tags?.includes("system-archive"));
    } else if (selectedParaType === "role" && selectedParaId) {
      notes = notes.filter(n => n.tags?.includes(`role-${selectedParaId}`) && !n.tags?.includes("system-archive"));
    } else if (selectedParaType === "archive") {
      notes = notes.filter(n => n.tags?.includes("system-archive"));
    } else if (selectedParaType === "all") {
      notes = notes.filter(n => !n.tags?.includes("system-archive"));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      notes = notes.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.content.toLowerCase().includes(query)
      );
    }

    if (selectedTagFilter) {
      notes = notes.filter(n => (n.tags || []).includes(selectedTagFilter));
    }

    // Sort: pinned first, then by updated date
    return notes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [state.notes, selectedParaType, selectedParaId, searchQuery, selectedTagFilter]);

  // Generate auto tags from roles, goals, projects
  const availableTags = useMemo(() => {
    const tags: NoteTag[] = [...state.noteTags];

    // Add role tags
    state.roles.forEach(role => {
      if (!tags.find(t => t.type === "role" && t.referenceId === role.id)) {
        tags.push({
          id: `role-${role.id}`,
          name: role.name,
          color: "bg-primary",
          type: "role",
          referenceId: role.id
        });
      }
    });

    // Add goal tags
    state.goals.forEach(goal => {
      if (!tags.find(t => t.type === "goal" && t.referenceId === goal.id)) {
        const role = getRoleById(goal.roleId);
        tags.push({
          id: `goal-${goal.id}`,
          name: goal.title,
          color: "bg-secondary",
          type: "goal",
          referenceId: goal.id
        });
      }
    });

    // Add project tags
    state.projects.forEach(project => {
      if (!tags.find(t => t.type === "project" && t.referenceId === project.id)) {
        tags.push({
          id: `project-${project.id}`,
          name: project.name,
          color: "bg-accent",
          type: "project",
          referenceId: project.id
        });
      }
    });

    return tags;
  }, [state.noteTags, state.roles, state.goals, state.projects, getRoleById]);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    addNoteFolder({
      name: newFolderName.trim(),
      parentId: selectedParaType === "folder" ? selectedParaId : null
    });
    setNewFolderName("");
    setShowNewFolderDialog(false);
  };

  const handleCreateNote = (type: "note" | "whiteboard" | "document") => {
    if (selectedParaType === "folder" && !selectedParaId && state.noteFolders.length === 0) {
      // Create default folder if none exists
      addNoteFolder({ name: "Mis Apuntes", parentId: null });
    }

    const folderId = (selectedParaType === "folder" ? selectedParaId : null) || state.noteFolders[0]?.id || "";

    // Auto assign tag based on where user is standing
    const tags: string[] = [];
    if (selectedParaType === "project" && selectedParaId) {
      tags.push(`project-${selectedParaId}`);
    } else if (selectedParaType === "role" && selectedParaId) {
      tags.push(`role-${selectedParaId}`);
    } else if (selectedParaType === "archive") {
      tags.push("system-archive");
    }

    addNote({
      folderId,
      type,
      title: type === "note" ? "Nueva Nota" : type === "whiteboard" ? "Nueva Pizarra" : "Documentos",
      content: type === "whiteboard" ? "[]" : "",
      tags,
      isPinned: false
    });

    setShowNewNoteDialog(false);
  };

  const handleSelectNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setShowMobileSidebar(false);
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const renderFolderTree = (folders: (NoteFolder & { children: any[] })[], depth = 0) => {
    return folders.map(folder => {
      const isExpanded = expandedFolders.has(folder.id);
      const isSelected = selectedParaType === "folder" && selectedParaId === folder.id;
      const hasChildren = folder.children.length > 0;
      const notesCount = state.notes.filter(n => n.folderId === folder.id).length;

      return (
        <div key={folder.id}>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer group transition-colors",
              isSelected ? "bg-primary/10 text-primary" : "hover:bg-muted"
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => {
              setSelectedParaType("folder");
              setSelectedParaId(folder.id);
              if (hasChildren) toggleFolder(folder.id);
            }}
          >
            {hasChildren ? (
              <button
                className="p-1 -ml-1 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            ) : (
              <span className="min-w-[32px]" />
            )}

            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-amber-500" />
            ) : (
              <Folder className="w-4 h-4 text-amber-500" />
            )}

            <span className="flex-1 truncate text-sm">{folder.name}</span>

            {notesCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {notesCount}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 opacity-50 sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingFolderId(folder.id)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Renombrar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteNoteFolder(folder.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isExpanded && hasChildren && (
            <div>{renderFolderTree(folder.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case "whiteboard": return <PenTool className="w-4 h-4 text-purple-500" />;
      case "document": return <FileImage className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-emerald-500" />;
    }
  };

  // Sidebar content (shared between mobile and desktop)
  const sidebarContent = (
    <>
      {/* Search & Actions */}
      <div className="p-3 space-y-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar apuntes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9"
          />
        </div>

        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => setShowNewFolderDialog(true)}
          >
            <FolderPlus className="w-4 h-4 mr-1" />
            Carpeta
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => setShowNewNoteDialog(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nuevo
          </Button>
        </div>
      </div>

      {/* P.A.R.A Folders */}
      <div className="p-2 border-b border-border/50">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Navegación PARA
          </span>
          <button
            className={cn(
              "text-xs hover:text-foreground font-medium transition-colors",
              selectedParaType === "all" ? "text-primary" : "text-muted-foreground"
            )}
            onClick={() => { setSelectedParaType("all"); setSelectedParaId(null); }}
          >
            Todo
          </button>
        </div>

        <ScrollArea className="h-64 pr-2">
          {/* Proyectos */}
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 block">Proyectos</span>
            {state.projects.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-1">Sin proyectos activos</p>
            ) : (
              state.projects.map(p => (
                <div
                  key={p.id}
                  className={cn(
                    "cursor-pointer px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors",
                    selectedParaType === "project" && selectedParaId === p.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                  onClick={() => { setSelectedParaType("project"); setSelectedParaId(p.id); }}
                >
                  <FolderKanban className="w-4 h-4 text-emerald-500" />
                  <span className="truncate">{p.name}</span>
                </div>
              ))
            )}
          </div>

          {/* Áreas */}
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 block">Áreas (Roles)</span>
            {state.roles.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-1">Sin roles definidos</p>
            ) : (
              state.roles.map(r => (
                <div
                  key={r.id}
                  className={cn(
                    "cursor-pointer px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors",
                    selectedParaType === "role" && selectedParaId === r.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  )}
                  onClick={() => { setSelectedParaType("role"); setSelectedParaId(r.id); }}
                >
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="truncate">{r.name}</span>
                </div>
              ))
            )}
          </div>

          {/* Recursos */}
          <div className="mb-4">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 block">Recursos (Carpetas libes)</span>
            {folderTree.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-1">No hay carpetas</p>
            ) : (
              renderFolderTree(folderTree)
            )}
          </div>

          {/* Archivo */}
          <div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1 block">Archivo</span>
            <div
              className={cn(
                "cursor-pointer px-2 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors",
                selectedParaType === "archive" ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
              onClick={() => { setSelectedParaType("archive"); setSelectedParaId(null); }}
            >
              <Archive className="w-4 h-4 text-gray-500" />
              <span>Elementos Archivados</span>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Tags Filter */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center justify-between px-2 py-1 mb-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Etiquetas
          </span>
          {selectedTagFilter && (
            <button
              className="text-xs text-primary"
              onClick={() => setSelectedTagFilter(null)}
            >
              Limpiar
            </button>
          )}
        </div>
        <ScrollArea className="h-24">
          <div className="flex flex-wrap gap-1 p-1">
            {availableTags.slice(0, 12).map(tag => (
              <Badge
                key={tag.id}
                variant={selectedTagFilter === tag.id ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedTagFilter(
                  selectedTagFilter === tag.id ? null : tag.id
                )}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Notes List */}
      <div className="flex-1 border-t border-border overflow-hidden">
        <div className="px-2 py-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
            Apuntes ({filteredNotes.length})
          </span>
        </div>

        <ScrollArea className="h-[calc(100%-28px)]">
          <div className="p-2 space-y-1">
            {filteredNotes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                No hay apuntes. Crea uno nuevo.
              </p>
            ) : (
              filteredNotes.map(note => (
                <div
                  key={note.id}
                  className={cn(
                    "p-2 rounded-lg cursor-pointer transition-colors group",
                    selectedNoteId === note.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted border border-transparent"
                  )}
                  onClick={() => handleSelectNote(note.id)}
                >
                  <div className="flex items-start gap-2">
                    {getNoteIcon(note.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        {note.isPinned && <Pin className="w-3 h-3 text-amber-500" />}
                        <span className="text-sm font-medium truncate">{note.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 opacity-50 sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => updateNote(note.id, { isPinned: !note.isPinned })}
                        >
                          <Pin className="w-4 h-4 mr-2" />
                          {note.isPinned ? "Desfijar" : "Fijar"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            deleteNote(note.id);
                            if (selectedNoteId === note.id) {
                              setSelectedNoteId(null);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );

  return (
    <div className="h-[calc(100dvh-120px)] flex">


      {/* Desktop Sidebar */}
      <aside className={cn(
        "w-full lg:w-72 border-r border-border bg-card/50 flex-col",
        // Mobile: Show sidebar only if NO note selected
        !selectedNote ? "flex" : "hidden lg:flex",
        isFullscreen && "hidden lg:hidden"
      )}>
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col overflow-hidden bg-background",
        // Mobile: Show main content only if note selected, otherwise hidden (showing sidebar)
        !isFullscreen && "fixed inset-0 z-40 lg:static lg:flex",
        isFullscreen && "fixed inset-0 z-50 lg:fixed lg:inset-0 lg:z-50",
        !selectedNote && "hidden lg:flex"
      )}>
        {selectedNote ? (
          <>
            {/* Mobile Back Button */}
            <div className="lg:hidden flex items-center gap-2 p-2 border-b border-border bg-background/80 backdrop-blur-md">
              <Button variant="ghost" size="sm" onClick={() => setSelectedNoteId(null)}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Volver
              </Button>
              <span className="font-medium truncate">{selectedNote.title}</span>
            </div>

            {selectedNote.type === "note" && (
              <NoteEditor
                note={selectedNote}
                availableTags={availableTags}
                onUpdate={(updates) => updateNote(selectedNote.id, updates)}
                onClose={() => setSelectedNoteId(null)}
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
              />
            )}
            {selectedNote.type === "whiteboard" && (
              <Whiteboard
                note={selectedNote}
                availableTags={availableTags}
                onUpdate={(updates) => updateNote(selectedNote.id, updates)}
                onClose={() => setSelectedNoteId(null)}
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
              />
            )}
            {selectedNote.type === "document" && (
              <DocumentManager
                note={selectedNote}
                availableTags={availableTags}
                onUpdate={(updates) => updateNote(selectedNote.id, updates)}
                onClose={() => setSelectedNoteId(null)}
                isFullscreen={isFullscreen}
                toggleFullscreen={toggleFullscreen}
              />
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Selecciona un apunte</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Elige un apunte de la lista o crea uno nuevo para empezar.
              </p>
              <Button onClick={() => setShowNewNoteDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Apunte
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Carpeta</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Nombre de la carpeta"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateFolder}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Note Dialog */}
      <Dialog open={showNewNoteDialog} onOpenChange={setShowNewNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo Apunte</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 py-4">
            <button
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => handleCreateNote("note")}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-sm font-medium">Nota</span>
              <span className="text-xs text-muted-foreground text-center">
                Estilo Notion
              </span>
            </button>

            <button
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => handleCreateNote("whiteboard")}
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <PenTool className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-sm font-medium">Pizarra</span>
              <span className="text-xs text-muted-foreground text-center">
                Excalidraw
              </span>
            </button>

            <button
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => handleCreateNote("document")}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileImage className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm font-medium">Documentos</span>
              <span className="text-xs text-muted-foreground text-center">
                Archivos
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}