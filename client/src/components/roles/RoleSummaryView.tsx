/**
 * Role Summary View
 * Shows daily summary for a specific role: activities, habits, upcoming goals
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import {
  X, Check, Target, Calendar, Repeat, FolderKanban,
  GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users,
  Plus, Trash2, Pencil, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Role, ROLE_COLORS } from "@/types/lifeOS";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users,
};

interface RoleSummaryViewProps {
  role: Role;
  onClose?: () => void;
  variant?: "modal" | "inline";
}

export function RoleSummaryView({ role, onClose, variant = "inline" }: RoleSummaryViewProps) {
  const {
    state,
    getGoalsByRole,
    getHabitsByRole,
    getActivitiesForDate,
    getHabitLogsForDate,
    logHabit,
    updateProjectActivity,
    addHabit,
    updateHabit,
    deleteHabit,
    addGoal,
    updateGoal,
    deleteGoal
  } = useLifeOSContext();

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editHabitName, setEditHabitName] = useState("");

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalQuarter, setNewGoalQuarter] = useState<1 | 2 | 3 | 4>(1);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editGoalTitle, setEditGoalTitle] = useState("");
  const [editGoalQuarter, setEditGoalQuarter] = useState<1 | 2 | 3 | 4>(1);

  const today = format(new Date(), "yyyy-MM-dd");
  const colors = ROLE_COLORS[role.color];
  const Icon = ICON_MAP[role.icon] || Users;

  // Get role-specific data
  const roleGoals = useMemo(() => getGoalsByRole(role.id), [role.id, getGoalsByRole]);
  const roleHabits = useMemo(() => getHabitsByRole(role.id), [role.id, getHabitsByRole]);
  const todayActivities = useMemo(() => {
    return getActivitiesForDate(today).filter(a => a.roleId === role.id);
  }, [today, role.id, getActivitiesForDate]);
  const todayHabitLogs = useMemo(() => getHabitLogsForDate(today), [today, getHabitLogsForDate]);

  // Upcoming goals (not completed, sorted by date)
  const upcomingGoals = useMemo(() => {
    return roleGoals
      .filter(g => g.status !== "completed")
      .sort((a, b) => {
        if (a.targetDate && b.targetDate) return a.targetDate.localeCompare(b.targetDate);
        if (a.targetDate) return -1;
        if (b.targetDate) return 1;
        return a.quarter - b.quarter;
      })
      .slice(0, 3);
  }, [roleGoals]);

  // Related projects
  const roleProjects = useMemo(() => {
    return state.projects.filter(p => {
      const goal = roleGoals.find(g => g.id === p.goalId);
      return !!goal;
    }).slice(0, 3);
  }, [state.projects, roleGoals]);

  const handleToggleHabit = (habitId: string) => {
    const existingLog = todayHabitLogs.find(l => l.habitId === habitId);
    const newStatus = existingLog?.status === "completed" ? "missed" : "completed";
    logHabit(habitId, today, newStatus);
  };

  const handleToggleActivity = (activityId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Completada" ? "Por hacer" : "Completada";
    updateProjectActivity(activityId, { status: newStatus });
  };

  const handleCreateHabit = () => {
    if (!newHabitName.trim()) return;
    addHabit({
      name: newHabitName.trim(),
      roleId: role.id,
      frequency: "daily"
    });
    setNewHabitName("");
    setIsAddingHabit(false);
  };

  const handleSaveEditHabit = () => {
    if (!editingHabitId || !editHabitName.trim()) return;
    updateHabit(editingHabitId, { name: editHabitName.trim() });
    setEditingHabitId(null);
  };

  const handleCreateGoal = () => {
    if (!newGoalTitle.trim()) return;
    addGoal({
      roleId: role.id,
      title: newGoalTitle.trim(),
      quarter: newGoalQuarter,
      semester: newGoalQuarter <= 2 ? 1 : 2,
      status: "pending",
      subGoals: [],
    });
    setNewGoalTitle("");
    setNewGoalQuarter(1);
    setIsAddingGoal(false);
  };

  const handleSaveEditGoal = () => {
    if (!editingGoalId || !editGoalTitle.trim()) return;
    updateGoal(editingGoalId, {
      title: editGoalTitle.trim(),
      quarter: editGoalQuarter,
      semester: editGoalQuarter <= 2 ? 1 : 2
    });
    setEditingGoalId(null);
  };

  const renderContent = () => (
    <>
      {/* Header */}
      <div className={cn("p-4 sm:p-6", colors.bg)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {role.imageUrl ? (
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/30">
                <img src={role.imageUrl} alt={role.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{role.name}</h2>
              <p className="text-white/70 text-sm">Resumen del día</p>
            </div>
          </div>
          {variant === "modal" && onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/20 min-h-[44px] min-w-[44px]"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Today's Activities */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm text-foreground">Actividades de Hoy</h3>
          </div>
          {todayActivities.length > 0 ? (
            <div className="space-y-2">
              {todayActivities.map((activity) => {
                const isCompleted = activity.status === "Completada";
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <button
                      onClick={() => !state.isReadOnly && handleToggleActivity(activity.id, activity.status)}
                      disabled={state.isReadOnly}
                      className="p-2 -m-2 group/btn"
                    >
                      <div className={cn(
                        "w-6 h-6 flex items-center justify-center rounded border-2 transition-all",
                        isCompleted
                          ? "bg-success border-success text-white"
                          : "border-border group-hover/btn:border-primary",
                        state.isReadOnly && "opacity-50 cursor-not-allowed"
                      )}>
                        {isCompleted && <Check className="w-4 h-4" />}
                      </div>
                    </button>
                    <span className={cn(
                      "text-sm flex-1 ml-1",
                      isCompleted && "line-through text-muted-foreground"
                    )}>
                      {activity.title}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sin actividades programadas para hoy
            </p>
          )}
        </section>

        {/* Habits */}
        {roleHabits.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm text-foreground">Hábitos</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setIsAddingHabit(!isAddingHabit)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {isAddingHabit && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                  <Input
                    autoFocus
                    placeholder="Nuevo hábito..."
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateHabit()}
                    className="h-8 text-sm"
                  />
                  <Button size="sm" onClick={handleCreateHabit} className="h-8">Guardar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingHabit(false)} className="h-8 px-2">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {roleHabits.map((habit) => {
                const log = todayHabitLogs.find(l => l.habitId === habit.id);
                const isCompleted = log?.status === "completed";
                return (
                  <div
                    key={habit.id}
                    className="group/item flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <button
                      onClick={() => !state.isReadOnly && handleToggleHabit(habit.id)}
                      disabled={state.isReadOnly}
                      className="p-2 -m-2 group/btn"
                    >
                      <div className={cn(
                        "w-6 h-6 flex items-center justify-center rounded border-2 transition-all",
                        isCompleted
                          ? "bg-success border-success text-white"
                          : "border-border group-hover/btn:border-primary",
                        state.isReadOnly && "opacity-50 cursor-not-allowed"
                      )}>
                        {isCompleted && <Check className="w-4 h-4" />}
                      </div>
                    </button>

                    {editingHabitId === habit.id ? (
                      <div className="flex-1 flex gap-2 items-center">
                        <Input
                          autoFocus
                          value={editHabitName}
                          onChange={(e) => setEditHabitName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEditHabit()}
                          className="h-7 text-sm py-1"
                        />
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleSaveEditHabit}>
                          <Check className="w-4 h-4 text-success" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setEditingHabitId(null)}>
                          <X className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className={cn(
                          "text-sm flex-1 ml-1 cursor-default",
                          isCompleted && "line-through text-muted-foreground"
                        )}>
                          {habit.name}
                        </span>

                        {!state.isReadOnly && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setEditingHabitId(habit.id);
                                setEditHabitName(habit.name);
                              }}>
                                <Pencil className="w-4 h-4 mr-2" /> Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10"
                                onClick={() => {
                                  if (confirm(`¿Eliminar hábito '${habit.name}'?`)) {
                                    deleteHabit(habit.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Upcoming Goals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Objetivos</h3>
            </div>
            {!state.isReadOnly && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setIsAddingGoal(!isAddingGoal)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {isAddingGoal && (
              <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/50 border border-border">
                <Input
                  autoFocus
                  placeholder="Título del objetivo..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="h-8 text-sm"
                />
                <div className="flex gap-2">
                  <Select
                    value={newGoalQuarter.toString()}
                    onValueChange={(v) => setNewGoalQuarter(parseInt(v) as 1 | 2 | 3 | 4)}
                  >
                    <SelectTrigger className="h-8 text-sm flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Q1 (Ene-Mar)</SelectItem>
                      <SelectItem value="2">Q2 (Abr-Jun)</SelectItem>
                      <SelectItem value="3">Q3 (Jul-Sep)</SelectItem>
                      <SelectItem value="4">Q4 (Oct-Dic)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleCreateGoal} className="h-8">Guardar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddingGoal(false)} className="h-8 px-2">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {roleGoals.length > 0 ? roleGoals.map((goal) => (
              <div key={goal.id} className="p-3 rounded-xl bg-muted/50 group/item relative">
                {editingGoalId === goal.id ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      autoFocus
                      value={editGoalTitle}
                      onChange={(e) => setEditGoalTitle(e.target.value)}
                      className="h-8 text-sm"
                    />
                    <div className="flex gap-2">
                      <Select
                        value={editGoalQuarter.toString()}
                        onValueChange={(v) => setEditGoalQuarter(parseInt(v) as 1 | 2 | 3 | 4)}
                      >
                        <SelectTrigger className="h-8 text-sm flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Q1</SelectItem>
                          <SelectItem value="2">Q2</SelectItem>
                          <SelectItem value="3">Q3</SelectItem>
                          <SelectItem value="4">Q4</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" onClick={handleSaveEditGoal} className="h-8">
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingGoalId(null)} className="h-8 px-2">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="pr-6">
                      <p className={cn("text-sm font-medium", goal.status === 'completed' && "line-through text-muted-foreground")}>{goal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          goal.status === 'completed' ? "bg-muted-foreground text-white" : colors.bg,
                          "text-white"
                        )}>
                          Q{goal.quarter}
                        </span>
                        {goal.targetDate && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(goal.targetDate), "d MMM", { locale: es })}
                          </span>
                        )}
                        {goal.status === 'completed' && (
                          <span className="text-xs text-success flex items-center gap-1 mt-0.5">
                            <Check className="w-3 h-3" /> Completado
                          </span>
                        )}
                      </div>
                    </div>

                    {!state.isReadOnly && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setEditingGoalId(goal.id);
                              setEditGoalTitle(goal.title);
                              setEditGoalQuarter(Math.min(Math.max(goal.quarter, 1), 4) as 1 | 2 | 3 | 4);
                            }}>
                              <Pencil className="w-4 h-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                const newStatus = goal.status === 'completed' ? 'pending' : 'completed';
                                updateGoal(goal.id, { status: newStatus });
                              }}
                            >
                              <Check className="w-4 h-4 mr-2" /> {goal.status === 'completed' ? 'Marcar Pendiente' : 'Marcar Completado'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:bg-destructive/10"
                              onClick={() => {
                                if (confirm(`¿Eliminar objetivo '${goal.title}'?`)) {
                                  deleteGoal(goal.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </>
                )}
              </div>
            )) : (
              !isAddingGoal && <p className="text-sm text-muted-foreground py-2 text-center bg-card rounded-xl">Sin objetivos</p>
            )}
          </div>
        </section>

        {/* Projects */}
        {roleProjects.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FolderKanban className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm text-foreground">Proyectos Activos</h3>
            </div>
            <div className="space-y-2">
              {roleProjects.map((project) => {
                const activities = state.projectActivities.filter(a => a.projectId === project.id);
                const completed = activities.filter(a => a.status === "Completada").length;
                const progress = activities.length > 0 ? (completed / activities.length) * 100 : 0;

                return (
                  <div key={project.id} className="p-3 rounded-xl bg-muted/50">
                    <p className="text-sm font-medium">{project.name}</p>
                    <div className="mt-2 h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", colors.bg)}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {completed}/{activities.length} actividades
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );

  // Inline variant - simple card layout
  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border shadow-card overflow-hidden"
      >
        {renderContent()}
      </motion.div>
    );
  }

  // Modal variant
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-card rounded-2xl border border-border shadow-elevated max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </motion.div>
    </motion.div>
  );
}
