/**
 * Wizard Step 4: Annual Goals
 * Define goals linked to each role
 */

import { useState } from "react";
import { Target, ArrowLeft, Check, Plus, X, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { ROLE_COLORS } from "@/types/lifeOS";
import { cn } from "@/lib/utils";

interface WizardStep4GoalsProps {
  onNext: () => void;
  onBack: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Dumbbell,
  Briefcase,
  Palette,
  Heart,
  Sparkles,
  Users2,
  Users,
};

export function WizardStep4Goals({ onNext, onBack }: WizardStep4GoalsProps) {
  const { state, addGoal, deleteGoal, updateGoal, updateYearSettings } = useLifeOSContext();
  const [selectedRole, setSelectedRole] = useState(state.roles[0]?.id || "");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalQuarter, setGoalQuarter] = useState<1 | 2 | 3 | 4>(1);
  const [h1Priority, setH1Priority] = useState(state.yearSettings?.h1Priority || "");
  const [h2Priority, setH2Priority] = useState(state.yearSettings?.h2Priority || "");

  // State for sub-goal inputs (keyed by goalId)
  const [subGoalInputs, setSubGoalInputs] = useState<Record<string, string>>({});

  const handleAddGoal = () => {
    if (!goalTitle.trim() || !selectedRole) return;
    addGoal({
      roleId: selectedRole,
      title: goalTitle.trim(),
      quarter: goalQuarter,
      semester: goalQuarter <= 2 ? 1 : 2,
      status: "pending",
      subGoals: [],
    });
    setGoalTitle("");
  };

  const handleAddSubGoal = (goalId: string) => {
    const title = subGoalInputs[goalId]?.trim();
    if (!title) return;

    const goal = state.goals.find(g => g.id === goalId);
    if (!goal) return;

    const currentSubGoals = goal.subGoals || [];
    // We add it to the local state optimistically or just wait for backend?
    // updateGoal expects partial goal.
    // If backend creates ID, better let backend handle it.
    // But we are sending an array of objects.
    // If we send an object WITHOUT ID, TypeORM creates it.
    // So:
    updateGoal(goalId, {
      subGoals: [...currentSubGoals, { title, completed: false }] as any // simplified type for creation
    });

    setSubGoalInputs(prev => ({ ...prev, [goalId]: "" }));
  };

  const handleDeleteSubGoal = (goalId: string, subGoalId: string) => {
    const goal = state.goals.find(g => g.id === goalId);
    if (!goal || !goal.subGoals) return;

    // To delete, we filter it out and save
    updateGoal(goalId, {
      subGoals: goal.subGoals.filter(sg => sg.id !== subGoalId)
    });
  };

  const handleComplete = () => {
    updateYearSettings({ h1Priority, h2Priority });
    onNext();
  };
  // ... rest of the file


  const getGoalsForRole = (roleId: string) => {
    return state.goals.filter(g => g.roleId === roleId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Objetivos 2026</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Define al menos un objetivo anual por rol. Asígnalos al trimestre que mejor corresponda.
          </p>
        </div>
      </div>

      {/* Semester Priorities */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Prioridad H1 (Ene-Jun)
          </label>
          <Input
            value={h1Priority}
            onChange={(e) => setH1Priority(e.target.value)}
            placeholder="ej: Programación y desarrollo"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Prioridad H2 (Jul-Dic)
          </label>
          <Input
            value={h2Priority}
            onChange={(e) => setH2Priority(e.target.value)}
            placeholder="ej: Tesis y administración"
          />
        </div>
      </div>

      {/* Add Goal Form */}
      <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
        <h3 className="font-medium text-foreground">Agregar objetivo</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              {state.roles.map((role) => {
                const Icon = ICON_MAP[role.icon] || Users;
                return (
                  <SelectItem key={role.id} value={role.id}>
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {role.name}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Input
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            placeholder="Título del objetivo"
            className="md:col-span-2"
          />

          <Select
            value={goalQuarter.toString()}
            onValueChange={(v) => setGoalQuarter(parseInt(v) as 1 | 2 | 3 | 4)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Q1 (Ene-Mar)</SelectItem>
              <SelectItem value="2">Q2 (Abr-Jun)</SelectItem>
              <SelectItem value="3">Q3 (Jul-Sep)</SelectItem>
              <SelectItem value="4">Q4 (Oct-Dic)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddGoal} disabled={!goalTitle.trim() || !selectedRole} className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar objetivo
        </Button>
      </div>

      {/* Goals by Role */}
      <div className="space-y-4">
        {state.roles.map((role) => {
          const Icon = ICON_MAP[role.icon] || Users;
          const goals = getGoalsForRole(role.id);
          const colors = ROLE_COLORS[role.color];

          return (
            <div key={role.id} className="border border-border rounded-xl overflow-hidden">
              <div className={cn("flex items-center gap-3 px-4 py-3", colors.bg)}>
                <Icon className="w-5 h-5 text-white" />
                <span className="font-medium text-white">{role.name}</span>
                <span className="text-white/70 text-sm ml-auto">
                  {goals.length} objetivo{goals.length !== 1 ? 's' : ''}
                </span>
              </div>
              {goals.length > 0 ? (
                <div className="divide-y divide-border">
                  {goals.map((goal) => (
                    <div key={goal.id} className="flex flex-col px-4 py-3 bg-card gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground font-medium">{goal.title}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            Q{goal.quarter}
                          </span>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors relative z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Sub-goals Section */}
                      <div className="ml-2 pl-4 border-l-2 border-border/50 space-y-2 mt-1">
                        {goal.subGoals?.map(sg => (
                          <div key={sg.id} className="flex items-center justify-between text-sm group">
                            <span className="text-muted-foreground">• {sg.title}</span>
                            <button
                              onClick={() => handleDeleteSubGoal(goal.id, sg.id)}
                              className="text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}

                        <div className="flex gap-2 items-center mt-2">
                          <Input
                            placeholder="+ Sub-objetivo (ej: Aprobar Matemáticas)"
                            className="h-7 text-sm py-1"
                            value={subGoalInputs[goal.id] || ""}
                            onChange={(e) => setSubGoalInputs(prev => ({ ...prev, [goal.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddSubGoal(goal.id);
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => handleAddSubGoal(goal.id)}
                            disabled={!subGoalInputs[goal.id]?.trim()}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground bg-card">
                  Sin objetivos definidos
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
        <Button
          onClick={handleComplete}
          disabled={state.goals.length === 0}
          size="lg"
          className="gap-2"
        >
          <Check className="w-4 h-4" />
          Completar Planificación
        </Button>
      </div>
    </div>
  );
}
