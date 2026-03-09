import { useState, useMemo } from "react";
import { Plus, Target, FolderKanban, Calendar as CalendarIcon, MoreVertical, ListTodo, ActivitySquare, FileText, ExternalLink } from "lucide-react";
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

export function ProjectsView() {
    const { state, setView, addNote, updateNote } = useLifeOSContext();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
            // Sort by active / due date
            if (a.progress === 100 && b.progress < 100) return 1;
            if (a.progress < 100 && b.progress === 100) return -1;
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    }, [state.projects, state.goals, state.roles, state.projectActivities]);

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
                <Button className="shrink-0 gap-2">
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
                                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground -mr-2 -mt-2">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
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
                <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-6">
                    {(() => {
                        const project = enrichedProjects.find(p => p.id === selectedProjectId);
                        if (!project) return null;

                        const projectNotes = state.notes.filter(n => n.tags?.includes(`project-${project.id}`));

                        const handleCreateLinkedNote = () => {
                            addNote({
                                folderId: state.noteFolders[0]?.id || "",
                                type: "note",
                                title: `Apunte: ${project.name}`,
                                content: "",
                                tags: [`project-${project.id}`],
                                isPinned: false
                            });
                            setView("notes");
                        };

                        return (
                            <>
                                <DialogHeader className="flex-none">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline" className="text-xs">{project.parentGoal?.title || "Sin meta"}</Badge>
                                        <Badge variant="secondary" className={cn("text-xs text-white", project.parentRole ? ROLE_COLORS[project.parentRole.color].bg : "bg-gray-500")}>
                                            {project.parentRole?.name || "Sin área"}
                                        </Badge>
                                    </div>
                                    <DialogTitle className="text-2xl flex items-center gap-2">
                                        <FolderKanban className="w-6 h-6 text-primary" />
                                        {project.name}
                                    </DialogTitle>
                                    {project.description && (
                                        <p className="text-muted-foreground mt-2">{project.description}</p>
                                    )}
                                </DialogHeader>

                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 min-h-0">
                                    {/* Left Panel: Activities */}
                                    <div className="flex flex-col border rounded-xl overflow-hidden bg-muted/10">
                                        <div className="px-4 py-3 border-b bg-card flex items-center justify-between">
                                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                                <ListTodo className="w-4 h-4" />
                                                Plan de Acción
                                            </h3>
                                            <span className="text-xs text-muted-foreground font-medium">
                                                {project.completedActivities.length} / {project.activities.length}
                                            </span>
                                        </div>
                                        <ScrollArea className="flex-1 p-4">
                                            {project.activities.length === 0 ? (
                                                <p className="text-sm text-muted-foreground text-center py-8">No hay actividades definidas.</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {project.activities.map(act => (
                                                        <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                                                            <div className={cn("w-4 h-4 rounded-full mt-0.5 border-2 flex-shrink-0", act.status.toLowerCase() === 'completada' || act.status.toLowerCase() === 'completado' ? "bg-success border-success" : "border-muted-foreground/30")} />
                                                            <div>
                                                                <p className={cn("text-sm font-medium", act.status.toLowerCase() === 'completada' || act.status.toLowerCase() === 'completado' && "line-through text-muted-foreground")}>{act.title}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </div>

                                    {/* Right Panel: Linked Notes (Segundo Cerebro) */}
                                    <div className="flex flex-col border rounded-xl overflow-hidden bg-primary/5 border-primary/10">
                                        <div className="px-4 py-3 border-b border-primary/10 bg-primary/10 flex items-center justify-between">
                                            <h3 className="font-semibold text-sm flex items-center gap-2 text-primary">
                                                <FileText className="w-4 h-4" />
                                                Recursos y Apuntes
                                            </h3>
                                            <Button size="sm" variant="ghost" className="h-7 text-xs text-primary hover:bg-primary/20" onClick={handleCreateLinkedNote}>
                                                <Plus className="w-3 h-3 mr-1" /> Nuevo
                                            </Button>
                                        </div>
                                        <ScrollArea className="flex-1 p-4">
                                            {projectNotes.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <FileText className="w-8 h-8 mx-auto text-primary/30 mb-2" />
                                                    <p className="text-sm text-primary/60">No hay apuntes vinculados a este proyecto.</p>
                                                    <p className="text-xs text-primary/40 mt-1">Usa esto para documentar investigación, links o minutas.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {projectNotes.map(note => (
                                                        <div
                                                            key={note.id}
                                                            className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-card hover:border-primary/50 transition-colors cursor-pointer group"
                                                            onClick={() => setView("notes")}
                                                        >
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <div className="truncate">
                                                                    <p className="text-sm font-medium truncate">{note.title}</p>
                                                                    <p className="text-xs text-muted-foreground">{format(new Date(note.updatedAt), "d MMM", { locale: es })}</p>
                                                                </div>
                                                            </div>
                                                            <ExternalLink className="w-4 h-4 text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>
        </div>
    );
}
