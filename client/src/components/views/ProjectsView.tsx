import { useState, useMemo } from "react";
import { Plus, Target, FolderKanban, Calendar as CalendarIcon, MoreVertical, ListTodo, ActivitySquare, FileText, ExternalLink, Check } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ROLE_COLORS } from "@/types/lifeOS";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/weekly/KanbanBoard";
import { toast } from "sonner";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { BrainCircuit, Paperclip, Trash2, Edit } from "lucide-react";

export function ProjectsView() {
    const { state, setView, setActiveNoteId, addNote, addProject, deleteProject, updateProject, addProjectActivity, updateProjectActivity } = useLifeOSContext();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [newProject, setNewProject] = useState({ name: "", goalId: "", dueDate: "", description: "" });

    // Link projects to their parent goals, and calculate completion from activities
    const enrichedProjects = useMemo(() => {
        return state.projects.map(project => {
            const parentGoal = state.goals.find(g => g.id === project.goalId);
            const parentRole = parentGoal ? state.roles.find(r => r.id === parentGoal.roleId) : null;

            const activities = state.projectActivities.filter(a => a.projectId === project.id);
            const completedActivities = activities.filter(a => a.status.toLowerCase() === 'completada' || a.status.toLowerCase() === 'completado');

            const progress = activities.length > 0
                ? Math.round((completedActivities.length / activities.length) * 100)
                : 0;

            return {
                ...project,
                parentGoal,
                parentRole,
                activities,
                completedActivities,
                progress
            };
        }).sort((a, b) => {
            // 1. Sort by Role Name
            const roleA = a.parentRole?.name || "zzz";
            const roleB = b.parentRole?.name || "zzz";
            if (roleA !== roleB) return roleA.localeCompare(roleB);

            // 2. Sort by Goal Title
            const goalA = a.parentGoal?.title || "zzz";
            const goalB = b.parentGoal?.title || "zzz";
            if (goalA !== goalB) return goalA.localeCompare(goalB);

            // 3. Sort by Progress (incomplete first)
            if (a.progress !== b.progress) return a.progress - b.progress;

            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    }, [state.projects, state.goals, state.roles, state.projectActivities]);

    const handleCreateProject = () => {
        if (!newProject.name.trim() || !newProject.goalId) {
            toast.error("El nombre y el objetivo son obligatorios");
            return;
        }

        addProject({
            name: newProject.name.trim(),
            goalId: newProject.goalId,
            description: newProject.description.trim() || undefined,
            dueDate: newProject.dueDate || undefined,
        });

        setNewProject({ name: "", goalId: "", dueDate: "", description: "" });
        setIsCreatingProject(false);
        toast.success("Proyecto creado exitosamente");
    };

    const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Evitar abrir el modal
        if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto y todas sus actividades?")) {
            try {
                await deleteProject(id);
                toast.success("Proyecto eliminado");
            } catch {
                toast.error("Error al eliminar proyecto");
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <FolderKanban className="w-8 h-8 text-primary" />
                        Proyectos Activos
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Tu segundo cerebro. Convierte tus grandes Objetivos en Proyectos medibles con acciones claras.
                    </p>
                </div>
                <Button className="shrink-0 gap-2" onClick={() => setIsCreatingProject(true)}>
                    <Plus className="w-4 h-4" /> Nuevo Proyecto
                </Button>
            </div>

            {enrichedProjects.length === 0 ? (
                <Card className="border-dashed flex items-center justify-center p-12 text-center bg-transparent mt-8">
                    <div className="max-w-md">
                        <FolderKanban className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-xl font-medium mb-2">Sin Proyectos Activos</h3>
                        <p className="text-muted-foreground">
                            No tienes proyectos definidos para tus objetivos actuales.
                            Haz clic en "Nuevo Proyecto" para empezar a estructurar tu trabajo.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrichedProjects.map(project => {
                        const roleColorClass = project.parentRole ? ROLE_COLORS[project.parentRole.color].bg : "bg-gray-500";
                        const isCompleted = project.progress === 100;

                        return (
                            <Card
                                key={project.id}
                                onClick={() => setSelectedProjectId(project.id)}
                                className={cn(
                                    "flex flex-col h-full bg-card cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group overflow-hidden relative",
                                    isCompleted && "opacity-75 grayscale-[0.3]"
                                )}
                            >
                                {/* Role Color Strip top */}
                                <div className={cn("h-1.5 w-full", roleColorClass)} />

                                <CardHeader className="pb-3 flex-none relative">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-1">
                                            <Badge variant="outline" className="text-[10px] font-medium tracking-wide uppercase px-2 py-0 border-primary/20 bg-primary/5 text-primary">
                                                {project.parentGoal?.title || "Sin Objetivo"}
                                            </Badge>
                                            <CardTitle className="text-lg leading-tight mt-2 flex items-center gap-2">
                                                {project.name}
                                            </CardTitle>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 shrink-0 text-muted-foreground -mr-2 -mt-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => setSelectedProjectId(project.id)}>
                                                    <Edit className="w-4 h-4 mr-2" /> Abrir Detalles
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={(e) => handleDeleteProject(e as any, project.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar Proyecto
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {project.description || "Sin descripción detallada."}
                                    </p>

                                    <div className="space-y-1.5 mt-auto">
                                        <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                                            <span>{project.progress}% Completado</span>
                                            <span className="flex items-center gap-1">
                                                <ListTodo className="w-3.5 h-3.5" />
                                                {project.completedActivities.length}/{project.activities.length}
                                            </span>
                                        </div>
                                        <Progress value={project.progress} className="h-2" />
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-3 pb-4 border-t border-border/10 bg-muted/10 flex justify-between items-center text-xs text-muted-foreground flex-none">
                                    <div className="flex items-center gap-1.5">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                        {project.dueDate ? (
                                            <span className={cn(
                                                isPast(new Date(project.dueDate)) && !isToday(new Date(project.dueDate)) && !isCompleted && "text-destructive font-medium"
                                            )}>
                                                {format(new Date(project.dueDate), "d MMM yyyy", { locale: es })}
                                            </span>
                                        ) : (
                                            "Sin Fecha"
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <ActivitySquare className="w-3.5 h-3.5" />
                                        {project.activities.length > 0 ? "En curso" : "Planificación"}
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Project Details Modal (Dashboard Individual) */}
            <Dialog open={!!selectedProjectId} onOpenChange={(open) => !open && setSelectedProjectId(null)}>
                <DialogContent className="max-w-4xl w-[98vw] sm:w-full h-[95vh] sm:h-[85vh] flex flex-col p-4 sm:p-6 overflow-hidden">
                    <DialogHeader className="flex-none p-0">
                        {(() => {
                            const project = enrichedProjects.find(p => p.id === selectedProjectId);
                            if (!project) return <DialogTitle>Detalles del Proyecto</DialogTitle>;
                            
                            return (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{project.parentGoal?.title || "Sin meta"}</Badge>
                                            <Badge variant="secondary" className={cn("text-[10px] uppercase tracking-wider text-white", project.parentRole ? ROLE_COLORS[project.parentRole.color].bg : "bg-gray-500")}>
                                                {project.parentRole?.name || "Sin área"}
                                            </Badge>
                                        </div>
                                        {project.dueDate && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <CalendarIcon className="w-3.5 h-3.5" />
                                                <span>{format(new Date(project.dueDate), "d MMM yyyy", { locale: es })}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <DialogTitle className="text-3xl font-bold tracking-tight">
                                            {project.name}
                                        </DialogTitle>
                                        {project.description && (
                                            <p className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-2xl">{project.description}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 py-2">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-medium text-muted-foreground">Progreso General</span>
                                                <span className="text-xs font-bold text-primary">{project.progress}%</span>
                                            </div>
                                            <Progress value={project.progress} className="h-1.5" />
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
                                            <ListTodo className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span className="text-xs font-semibold">{project.completedActivities.length}/{project.activities.length}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </DialogHeader>

                    {(() => {
                        const project = enrichedProjects.find(p => p.id === selectedProjectId);
                        if (!project) return null;

                        const projectNotes = state.notes.filter(n => 
                            (n.tags as any)?.some((t: any) => (typeof t === 'string' ? t : t.id) === `project-${project.id}`)
                        );

                        const handleCreateLinkedNote = async (type: "note" | "whiteboard" | "document") => {
                            const titles = {
                                note: "Apunte",
                                whiteboard: "Pizarra",
                                document: "Documento"
                            };

                            const tags = [`project-${project.id}`];
                            if (project.parentGoal?.id) tags.push(`goal-${project.parentGoal.id}`);
                            if (project.parentRole?.id) tags.push(`role-${project.parentRole.id}`);

                            await addNote({
                                folderId: state.noteFolders[0]?.id || "",
                                type,
                                title: `${titles[type]}: ${project.name}`,
                                content: type === "whiteboard" ? "[]" : "",
                                tags,
                                isPinned: false
                            });
                            toast.success("Recurso creado y vinculado");
                        };

                        return (
                            <Tabs defaultValue="activities" className="flex-1 flex flex-col mt-4 min-h-0">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="activities" className="gap-2 text-xs sm:text-sm px-2">
                                        <ActivitySquare className="w-4 h-4" />
                                        <span className="hidden xs:inline">Plan de Acción</span>
                                        <span className="xs:hidden">Kanban</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="notes" className="gap-2 text-xs sm:text-sm px-2">
                                        <FileText className="w-4 h-4" />
                                        <span>Recursos</span>
                                        <span className="hidden sm:inline">({projectNotes.length})</span>
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="activities" className="flex-1 min-h-0 focus-visible:outline-none">
                                    <ScrollArea className="h-full pr-4">
                                        <div className="pb-8">
                                            <KanbanBoard project={project} />
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                <TabsContent value="notes" className="flex-1 min-h-0 focus-visible:outline-none">
                                    <div className="flex flex-col h-full border rounded-2xl overflow-hidden bg-muted/10 border-border/50">
                                        <div className="px-5 py-3 border-b border-border/50 bg-card flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-primary" />
                                                <h3 className="font-bold text-sm">Biblioteca del Proyecto</h3>
                                            </div>
                                            
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="sm" className="h-8 gap-2">
                                                        <Plus className="w-3.5 h-3.5" /> Nuevo Recurso
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Tipo de Recurso</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleCreateLinkedNote("note")} className="gap-2">
                                                        <FileText className="w-4 h-4" />
                                                        <span>Nuevo Apunte</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleCreateLinkedNote("whiteboard")} className="gap-2">
                                                        <BrainCircuit className="w-4 h-4" />
                                                        <span>Nueva Pizarra</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleCreateLinkedNote("document")} className="gap-2">
                                                        <Paperclip className="w-4 h-4" />
                                                        <span>Subir Archivo / Doc</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        
                                        <ScrollArea className="flex-1 p-4">
                                            {projectNotes.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                                                        <FileText className="w-8 h-8 text-primary/20" />
                                                    </div>
                                                    <h4 className="font-semibold text-muted-foreground">Sin recursos aún</h4>
                                                    <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
                                                        Usa este espacio para guardar notas de investigación, enlaces o minutas de este proyecto.
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {projectNotes.map(note => (
                                                        <div
                                                            key={note.id}
                                                            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                                                            onClick={() => {
                                                                setActiveNoteId(note.id);
                                                                setView("notes");
                                                            }}
                                                        >
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                                    {note.type === "whiteboard" ? (
                                                                        <BrainCircuit className="w-5 h-5" />
                                                                    ) : note.type === "document" ? (
                                                                        <Paperclip className="w-5 h-5" />
                                                                    ) : (
                                                                        <FileText className="w-5 h-5" />
                                                                    )}
                                                                </div>
                                                                <div className="truncate">
                                                                    <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{note.title}</p>
                                                                    <p className="text-[10px] text-muted-foreground uppercase font-medium">{format(new Date(note.updatedAt), "d MMM yyyy", { locale: es })}</p>
                                                                </div>
                                                            </div>
                                                            <ExternalLink className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            {/* Create Project Modal */}
            <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Nuevo Proyecto</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre del Proyecto</Label>
                            <Input
                                id="name"
                                value={newProject.name}
                                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ej: Lanzamiento de App, Mudanza..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="goal">Objetivo Vinculado</Label>
                            <Select
                                value={newProject.goalId}
                                onValueChange={(v) => setNewProject(prev => ({ ...prev, goalId: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar objetivo..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {state.goals.map(goal => (
                                        <SelectItem key={goal.id} value={goal.id}>
                                            {goal.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Descripción (Opcional)</Label>
                            <Input
                                id="description"
                                value={newProject.description}
                                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Breve descripción del alcance..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dueDate">Fecha Límite (Opcional)</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={newProject.dueDate}
                                onChange={(e) => setNewProject(prev => ({ ...prev, dueDate: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsCreatingProject(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleCreateProject}
                            disabled={!newProject.name.trim() || !newProject.goalId}
                        >
                            Crear Proyecto
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
