/**
 * Semester View - Roadmap
 * Shows goals organized by quarter with drag-and-drop reordering
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users, Check, Clock, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Goal, ROLE_COLORS } from "@/types/lifeOS";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const { state, getGoalsByQuarter, updateGoal, addGoal, deleteGoal, getRoleById } = useLifeOSContext();
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalRole, setNewGoalRole] = useState("");
  const [newGoalQuarter, setNewGoalQuarter] = useState<1 | 2 | 3 | 4>(1);

  const visibleQuarters = QUARTERS.filter(q => q.semester === selectedSemester);

  const handleMoveGoal = (goalId: string, newQuarter: 1 | 2 | 3 | 4) => {
    updateGoal(goalId, { 
      quarter: newQuarter, 
      semester: newQuarter <= 2 ? 1 : 2 
    });
  };

  const handleStatusChange = (goalId: string, status: Goal["status"]) => {
    updateGoal(goalId, { status });
  };

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalRole) return;
    addGoal({
      roleId: newGoalRole,
      title: newGoalTitle.trim(),
      quarter: newGoalQuarter,
      semester: newGoalQuarter <= 2 ? 1 : 2,
      status: "pending",
    });
    setNewGoalTitle("");
    setIsAddingGoal(false);
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
        <div className="flex items-center gap-2">
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
                  onValueChange={(v) => setNewGoalQuarter(parseInt(v) as 1|2|3|4)}
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
          const goals = getGoalsByQuarter(quarter.id as 1|2|3|4);
          
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
                            <p className="text-xs text-muted-foreground">{role?.name}</p>
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
                            onValueChange={(v) => handleMoveGoal(goal.id, parseInt(v) as 1|2|3|4)}
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
                        </div>
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
