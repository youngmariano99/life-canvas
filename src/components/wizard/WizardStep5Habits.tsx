/**
 * Wizard Step 5: Habits per Role
 * Define habits linked to each role during planning
 */

import { useState } from "react";
import { Activity, ArrowLeft, Check, Plus, X, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { ROLE_COLORS } from "@/types/lifeOS";
import { cn } from "@/lib/utils";

interface WizardStep5HabitsProps {
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

export function WizardStep5Habits({ onNext, onBack }: WizardStep5HabitsProps) {
  const { state, addHabit, deleteHabit } = useLifeOSContext();
  const [selectedRole, setSelectedRole] = useState(state.roles[0]?.id || "");
  const [habitName, setHabitName] = useState("");

  const handleAddHabit = () => {
    if (!habitName.trim()) return;
    addHabit({
      name: habitName.trim(),
      roleId: selectedRole || undefined,
      frequency: "daily",
    });
    setHabitName("");
  };

  const getHabitsForRole = (roleId: string) => {
    return state.habits.filter(h => h.roleId === roleId);
  };

  const habitsWithoutRole = state.habits.filter(h => !h.roleId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-success/10 flex items-center justify-center">
          <Activity className="w-8 h-8 text-success" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Hábitos por Rol</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Define los hábitos que te ayudarán a cumplir tus objetivos en cada rol.
          </p>
        </div>
      </div>

      {/* Add Habit Form */}
      <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
        <h3 className="font-medium text-foreground">Agregar hábito</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Rol (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Sin rol específico</SelectItem>
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
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="Nombre del hábito"
            className="md:col-span-2"
            onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
          />
        </div>
        <Button onClick={handleAddHabit} disabled={!habitName.trim()} className="gap-2">
          <Plus className="w-4 h-4" />
          Agregar hábito
        </Button>
      </div>

      {/* Habits by Role */}
      <div className="space-y-4">
        {state.roles.map((role) => {
          const Icon = ICON_MAP[role.icon] || Users;
          const habits = getHabitsForRole(role.id);
          const colors = ROLE_COLORS[role.color];
          
          return (
            <div key={role.id} className="border border-border rounded-xl overflow-hidden">
              <div className={cn("flex items-center gap-3 px-4 py-3", colors.bg)}>
                <Icon className="w-5 h-5 text-white" />
                <span className="font-medium text-white">{role.name}</span>
                <span className="text-white/70 text-sm ml-auto">
                  {habits.length} hábito{habits.length !== 1 ? 's' : ''}
                </span>
              </div>
              {habits.length > 0 ? (
                <div className="divide-y divide-border">
                  {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center justify-between px-4 py-3 bg-card">
                      <span className="text-foreground">{habit.name}</span>
                      <button 
                        onClick={() => deleteHabit(habit.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-muted-foreground bg-card">
                  Sin hábitos definidos
                </div>
              )}
            </div>
          );
        })}

        {/* Habits without role */}
        {habitsWithoutRole.length > 0 && (
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 bg-muted">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Sin rol asignado</span>
              <span className="text-muted-foreground text-sm ml-auto">
                {habitsWithoutRole.length} hábito{habitsWithoutRole.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="divide-y divide-border">
              {habitsWithoutRole.map((habit) => (
                <div key={habit.id} className="flex items-center justify-between px-4 py-3 bg-card">
                  <span className="text-foreground">{habit.name}</span>
                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
        <Button 
          onClick={onNext}
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
