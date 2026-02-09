/**
 * Semester View - Roadmap
 * Shows goals organized by quarter with optional exact dates
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users, Check, Clock, Pause, X, Calendar, Eye, EyeOff, Package } from "lucide-react";
import { format, parseISO, isWithinInterval, startOfQuarter, endOfQuarter, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Goal, ROLE_COLORS } from "@/types/lifeOS";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResourceManager } from "@/components/resources/ResourceManager";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users,
};

const QUARTERS = [
  { id: 1, label: "Q1", months: "Ene - Mar", semester: 1 },
  { id: 2, label: "Q2", months: "Abr - Jun", semester: 1 },
  { id: 3, label: "Q3", months: "Jul - Sep", semester: 2 },
  { id: 4, label: "Q4", months: "Oct - Dic", semester: 2 },
] as const;

const STATUS_CONFIG = {
  pending: { icon: Clock, label: "Pendiente", class: "bg-muted text-muted-foreground" },
  in_progress: { icon: Clock, label: "En progreso", class: "bg-info/20 text-info" },
  completed: { icon: Check, label: "Completado", class: "bg-success/20 text-success" },
  deferred: { icon: Pause, label: "Diferido", class: "bg-warning/20 text-warning" },
};

export function SemesterView() {
  const { state, getGoalsByQuarter, updateGoal, addGoal, deleteGoal, getRoleById, toggleShowPastItems } = useLifeOSContext();
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalRole, setNewGoalRole] = useState("");
  const [newGoalQuarter, setNewGoalQuarter] = useState<1 | 2 | 3 | 4>(1);
  const [newGoalDate, setNewGoalDate] = useState("");

  const visibleQuarters = QUARTERS.filter(q => q.semester === selectedSemester);
  const today = new Date();

  // Get current quarter for filtering
  const currentQuarter = Math.ceil((today.getMonth() + 1) / 3) as 1 | 2 | 3 | 4;

  const handleMoveGoal = (goalId: string, newQuarter: 1 | 2 | 3 | 4) => {
    updateGoal(goalId, {
      quarter: newQuarter,
      semester: newQuarter <= 2 ? 1 : 2
    });
  };

  const handleStatusChange = (goalId: string, status: Goal["status"]) => {
    updateGoal(goalId, { status });
  };

  const handleDateChange = (goalId: string, date: string) => {
    updateGoal(goalId, { targetDate: date || undefined });
  };

  const [subGoalInputs, setSubGoalInputs] = useState<Record<string, string>>({});

  const handleAddSubGoal = (goalId: string) => {
    const title = subGoalInputs[goalId]?.trim();
    if (!title) return;

    const goal = getGoalById(goalId); // Need helper or find in list
    if (!goal) return;

    const currentSubGoals = goal.subGoals || [];
    updateGoal(goalId, {
      subGoals: [...currentSubGoals, { title, completed: false }] as any
    });

    setSubGoalInputs(prev => ({ ...prev, [goalId]: "" }));
  };

  const handleDeleteSubGoal = (goalId: string, subGoalId: string) => {
    const goal = getGoalById(goalId);
    if (!goal || !goal.subGoals) return;

    updateGoal(goalId, {
      subGoals: goal.subGoals.filter(sg => sg.id !== subGoalId)
    });
  };

  const handleToggleSubGoal = (goalId: string, subGoalId: string) => {
    const goal = getGoalById(goalId);
    if (!goal || !goal.subGoals) return;

    const updatedSubGoals = goal.subGoals.map(sg =>
      sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
    );

    updateGoal(goalId, { subGoals: updatedSubGoals });
  };

  const getGoalById = (id: string) => state.goals.find(g => g.id === id);

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalRole) return;
    addGoal({
      roleId: newGoalRole,
      title: newGoalTitle.trim(),
      quarter: newGoalQuarter,
      semester: newGoalQuarter <= 2 ? 1 : 2,
      status: "pending",
      targetDate: newGoalDate || undefined,
      subGoals: [],
    });
    setNewGoalTitle("");
    setNewGoalDate("");
    setIsAddingGoal(false);
  };

  // Filter goals
  const filterGoals = (goals: Goal[]) => {
    return goals.filter(goal => {
      // Role filter
      if (selectedRoleFilter !== "all" && goal.roleId !== selectedRoleFilter) {
        return false;
      }

      // Time filter - hide past quarters unless showPastItems is true
      if (!state.showPastItems) {
        if (goal.targetDate) {
          const goalDate = parseISO(goal.targetDate);
          if (isBefore(goalDate, today) && goal.status !== "completed") {
            // Keep showing if not completed
          }
        } else if (goal.quarter < currentQuarter && goal.status !== "completed") {
          // Hide past quarter goals that aren't completed
          return false;
        }
      }

      return true;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Roadmap 2026</h2>
          <p className="text-muted-foreground">
            {selectedSemester === 1
              ? state.yearSettings?.h1Priority || "Primer Semestre"
              : state.yearSettings?.h2Priority || "Segundo Semestre"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectedSemester === 1 ? "default" : "outline"}
            onClick={() => setSelectedSemester(1)}
            size="sm"
          >
            H1
          </Button>
          <Button
            variant={selectedSemester === 2 ? "default" : "outline"}
            onClick={() => setSelectedSemester(2)}
            size="sm"
          >
            H2
          </Button>

          {/* Role Filter */}
          <Select value={selectedRoleFilter} onValueChange={setSelectedRoleFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filtrar rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
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
          </Button>

          <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 ml-2">
                <Plus className="w-4 h-4" />
                Objetivo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Objetivo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Título del objetivo"
                />
                <Select value={newGoalRole} onValueChange={setNewGoalRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={newGoalQuarter.toString()}
                  onValueChange={(v) => setNewGoalQuarter(parseInt(v) as 1 | 2 | 3 | 4)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUARTERS.map((q) => (
                      <SelectItem key={q.id} value={q.id.toString()}>
                        {q.label} ({q.months})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div>
                  <label className="text-sm text-muted-foreground">Fecha exacta (opcional)</label>
                  <Input
                    type="date"
                    value={newGoalDate}
                    onChange={(e) => setNewGoalDate(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddGoal} disabled={!newGoalTitle.trim() || !newGoalRole} className="w-full">
                  Agregar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quarters Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {visibleQuarters.map((quarter) => {
          const allGoals = getGoalsByQuarter(quarter.id as 1 | 2 | 3 | 4);
          const goals = filterGoals(allGoals);

          return (
            <motion.div
              key={quarter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border overflow-hidden shadow-card"
            >
              {/* Quarter Header */}
              <div className="bg-secondary/50 px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{quarter.label}</h3>
                    <p className="text-sm text-muted-foreground">{quarter.months}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {goals.length} objetivo{goals.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Goals List */}
              <div className="p-4 space-y-3 min-h-[200px]">
                {goals.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                    Sin objetivos en este trimestre
                  </div>
                ) : (
                  goals.map((goal) => {
                    const role = getRoleById(goal.roleId);
                    const Icon = role ? ICON_MAP[role.icon] || Users : Users;
                    const colors = role ? ROLE_COLORS[role.color] : ROLE_COLORS.student;
                    const statusConfig = STATUS_CONFIG[goal.status];
                    const isExpanded = expandedGoalId === goal.id;

                    return (
                      <motion.div
                        key={goal.id}
                        layout
                        className="bg-background rounded-xl border border-border p-4 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colors.bg)}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground truncate">{goal.title}</h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-muted-foreground">{role?.name}</p>
                              {goal.targetDate && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {format(parseISO(goal.targetDate), "d MMM", { locale: es })}
                                </span>
                              )}
                            </div>

                            {/* Sub-goals List */}
                            <div className="mt-3 space-y-1.5">
                              {goal.subGoals?.map(sg => (
                                <div key={sg.id} className="flex items-start gap-2 group">
                                  <button
                                    onClick={() => handleToggleSubGoal(goal.id, sg.id)}
                                    className={cn(
                                      "mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                      sg.completed ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30 hover:border-primary/50"
                                    )}
                                  >
                                    {sg.completed && <Check className="w-3 h-3" />}
                                  </button>
                                  <span className={cn(
                                    "text-sm flex-1 break-words leading-tight",
                                    sg.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground/90"
                                  )}>
                                    {sg.title}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteSubGoal(goal.id, sg.id)}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}

                              {/* Add Subgoal Input - Only show if goal is hovered or has subgoals, or just always show small input? 
                                   Let's put it always but subtle.
                               */}
                              <div className="flex items-center gap-2 mt-2">
                                <Input
                                  className="h-6 text-xs bg-muted/30 border-none focus-visible:ring-1"
                                  placeholder="+ Sub-objetivo"
                                  value={subGoalInputs[goal.id] || ""}
                                  onChange={(e) => setSubGoalInputs(prev => ({ ...prev, [goal.id]: e.target.value }))}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddSubGoal(goal.id);
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Select
                            value={goal.status}
                            onValueChange={(v) => handleStatusChange(goal.id, v as Goal["status"])}
                          >
                            <SelectTrigger className={cn("h-7 text-xs w-auto", statusConfig.class)}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                <SelectItem key={key} value={key}>{config.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={goal.quarter.toString()}
                            onValueChange={(v) => handleMoveGoal(goal.id, parseInt(v) as 1 | 2 | 3 | 4)}
                          >
                            <SelectTrigger className="h-7 text-xs w-auto bg-muted">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {QUARTERS.map((q) => (
                                <SelectItem key={q.id} value={q.id.toString()}>
                                  Mover a {q.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Input
                            type="date"
                            value={goal.targetDate || ""}
                            onChange={(e) => handleDateChange(goal.id, e.target.value)}
                            className="h-7 text-xs w-auto"
                            placeholder="Fecha"
                          />

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                          >
                            <Package className="w-3 h-3" />
                            Recursos
                          </Button>
                        </div>

                        {/* Resources Section */}
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-3 border-t border-border"
                          >
                            <ResourceManager goalId={goal.id} resources={goal.resources || []} />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
