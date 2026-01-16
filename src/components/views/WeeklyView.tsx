/**
 * Weekly Planning View
 * Projects with Kanban board for activities + Event Calendar
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, addWeeks, subWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, ChevronLeft, ChevronRight, FolderKanban, Calendar, Target, Eye, EyeOff, X, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_COLORS } from "@/types/lifeOS";
import { KanbanBoard } from "@/components/weekly/KanbanBoard";
import { EventCalendar } from "@/components/calendar/EventCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users,
};

export function WeeklyView() {
  const { 
    state, 
    addProject, 
    deleteProject,
    getRoleById,
    toggleShowPastItems 
  } = useLifeOSContext();
  
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", goalId: "", dueDate: "" });
  const [activeTab, setActiveTab] = useState<string>("projects");

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  // Filter projects by week and role
  const filteredProjects = useMemo(() => {
    return state.projects.filter(project => {
      // Filter by role
      if (selectedRoleFilter !== "all") {
        const goal = state.goals.find(g => g.id === project.goalId);
        if (goal?.roleId !== selectedRoleFilter) return false;
      }

      // Filter by date if not showing past items
      if (!state.showPastItems && project.dueDate) {
        const projectDate = parseISO(project.dueDate);
        if (!isWithinInterval(projectDate, { start: weekStart, end: weekEnd })) {
          return false;
        }
      }

      return true;
    });
  }, [state.projects, state.goals, selectedRoleFilter, state.showPastItems, weekStart, weekEnd]);

  const selectedProject = selectedProjectId 
    ? state.projects.find(p => p.id === selectedProjectId)
    : null;

  const handleAddProject = () => {
    if (!newProject.name.trim() || !newProject.goalId) return;
    addProject({
      name: newProject.name.trim(),
      goalId: newProject.goalId,
      dueDate: newProject.dueDate || undefined,
    });
    setNewProject({ name: "", goalId: "", dueDate: "" });
    setIsAddingProject(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Planificación Semanal</h2>
          <p className="text-muted-foreground">
            Semana del {format(weekStart, "d 'de' MMMM", { locale: es })} al {format(weekEnd, "d 'de' MMMM", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Week Navigation */}
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSelectedWeek(subWeeks(selectedWeek, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedWeek(new Date())}
            >
              Esta semana
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setSelectedWeek(addWeeks(selectedWeek, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for Projects and Calendar */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="projects" className="gap-2">
            <FolderKanban className="w-4 h-4" />
            <span className="hidden sm:inline">Proyectos</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Calendario</span>
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          {/* Project Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Role Filter */}
            <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filtrar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                {state.roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Toggle Past Items */}
            <Button
              variant={state.showPastItems ? "default" : "outline"}
              size="sm"
              onClick={toggleShowPastItems}
              className="gap-1"
            >
              {state.showPastItems ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{state.showPastItems ? "Ocultar pasados" : "Ver todos"}</span>
            </Button>

            {/* Add Project */}
            <Dialog open={isAddingProject} onOpenChange={setIsAddingProject}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Proyecto</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nuevo Proyecto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nombre del proyecto"
                  />
                  <Select 
                    value={newProject.goalId} 
                    onValueChange={(v) => setNewProject(prev => ({ ...prev, goalId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Vincular a objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {state.goals.map((goal) => {
                        const role = getRoleById(goal.roleId);
                        return (
                          <SelectItem key={goal.id} value={goal.id}>
                            <span className="flex items-center gap-2">
                              <span className={cn(
                                "w-2 h-2 rounded-full",
                                role ? ROLE_COLORS[role.color].bg : "bg-muted"
                              )} />
                              {goal.title}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <div>
                    <label className="text-sm text-muted-foreground">Fecha límite (opcional)</label>
                    <Input
                      type="date"
                      value={newProject.dueDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <Button 
                    onClick={handleAddProject} 
                    disabled={!newProject.name.trim() || !newProject.goalId} 
                    className="w-full"
                  >
                    Crear Proyecto
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Project List or Kanban */}
          {selectedProject ? (
            <div className="space-y-4">
              {/* Back Button */}
              <Button 
                variant="ghost" 
                onClick={() => setSelectedProjectId(null)}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Volver a proyectos
              </Button>
              
              {/* Project Header */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedProject.name}</h3>
                    {selectedProject.dueDate && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {format(parseISO(selectedProject.dueDate), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      deleteProject(selectedProject.id);
                      setSelectedProjectId(null);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Kanban Board */}
              <KanbanBoard project={selectedProject} />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full bg-card rounded-2xl border border-border p-8 text-center">
                  <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No hay proyectos para esta semana. Crea uno para empezar a planificar.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 gap-1"
                    onClick={() => setIsAddingProject(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Crear proyecto
                  </Button>
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const goal = state.goals.find(g => g.id === project.goalId);
                  const role = goal ? getRoleById(goal.roleId) : null;
                  const Icon = role ? ICON_MAP[role.icon] || Users : Target;
                  const colors = role ? ROLE_COLORS[role.color] : { bg: "bg-muted", text: "text-muted-foreground" };
                  const activities = state.projectActivities.filter(a => a.projectId === project.id);
                  const completedActivities = activities.filter(a => a.status === "Completada").length;

                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-card rounded-xl border border-border p-5 cursor-pointer hover:shadow-card transition-all"
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{project.name}</h4>
                          {goal && (
                            <p className="text-xs text-muted-foreground truncate">{goal.title}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {completedActivities}/{activities.length} actividades
                        </span>
                        {project.dueDate && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(parseISO(project.dueDate), "d MMM", { locale: es })}
                          </span>
                        )}
                      </div>

                      {/* Progress */}
                      {activities.length > 0 && (
                        <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all", colors.bg)}
                            style={{ width: `${(completedActivities / activities.length) * 100}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <EventCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
