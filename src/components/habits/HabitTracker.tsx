/**
 * Habit Tracker Component
 * Weekly grid for habit tracking, grouped by role
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Check, X, Minus, MoreHorizontal, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { HabitLog, ROLE_COLORS } from "@/types/lifeOS";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface HabitTrackerProps {
  selectedDate: string;
}

const STATUS_ICONS = {
  completed: { icon: Check, class: "bg-success text-white", label: "Cumplí" },
  missed: { icon: X, class: "bg-destructive text-white", label: "No cumplí" },
  day_off: { icon: Minus, class: "bg-muted text-muted-foreground", label: "Día libre" },
  other: { icon: MoreHorizontal, class: "bg-warning text-white", label: "Otros" },
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users,
};

export function HabitTracker({ selectedDate }: HabitTrackerProps) {
  const { state, addHabit, logHabit, getRoleById } = useLifeOSContext();
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitRole, setNewHabitRole] = useState("");

  // Get week days
  const selectedDateObj = parseISO(selectedDate);
  const weekStart = startOfWeek(selectedDateObj, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Create logs map for quick lookup
  const logsMap = useMemo(() => {
    const map: Record<string, Record<string, HabitLog>> = {};
    state.habitLogs.forEach(log => {
      if (!map[log.habitId]) map[log.habitId] = {};
      map[log.habitId][log.date] = log;
    });
    return map;
  }, [state.habitLogs]);

  // Group habits by role
  const habitsByRole = useMemo(() => {
    const grouped: Record<string, typeof state.habits> = {};
    
    state.habits.forEach(habit => {
      const roleId = habit.roleId || "no-role";
      if (!grouped[roleId]) grouped[roleId] = [];
      grouped[roleId].push(habit);
    });

    return grouped;
  }, [state.habits]);

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    addHabit({
      name: newHabitName.trim(),
      roleId: newHabitRole === "none" ? undefined : newHabitRole || undefined,
      frequency: "daily",
    });
    setNewHabitName("");
    setNewHabitRole("");
    setIsAddingHabit(false);
  };

  const handleToggleStatus = (habitId: string, date: string, currentStatus?: HabitLog["status"]) => {
    const statusOrder: HabitLog["status"][] = ["completed", "missed", "day_off"];
    const currentIndex = currentStatus ? statusOrder.indexOf(currentStatus) : -1;
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    logHabit(habitId, date, nextStatus);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Hábitos Semanales</h3>
          <p className="text-sm text-muted-foreground">
            Semana del {format(weekStart, "d 'de' MMMM", { locale: es })}
          </p>
        </div>
        <Dialog open={isAddingHabit} onOpenChange={setIsAddingHabit}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              Hábito
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Hábito</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="Nombre del hábito"
                onKeyDown={(e) => e.key === "Enter" && handleAddHabit()}
              />
              <Select value={newHabitRole} onValueChange={setNewHabitRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Asociar a rol (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin rol</SelectItem>
                  {state.roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddHabit} disabled={!newHabitName.trim()} className="w-full">
                Agregar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(STATUS_ICONS).map(([key, config]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn("w-4 h-4 rounded flex items-center justify-center", config.class)}>
              <config.icon className="w-2.5 h-2.5" />
            </div>
            <span className="text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Habit Grid by Role */}
      {state.habits.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <p className="text-muted-foreground">
            No hay hábitos definidos. Agrega tu primer hábito para comenzar a trackear.
          </p>
          <Button 
            variant="outline" 
            className="mt-4 gap-1"
            onClick={() => setIsAddingHabit(true)}
          >
            <Plus className="w-4 h-4" />
            Agregar hábito
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(habitsByRole).map(([roleId, habits]) => {
            const role = roleId !== "no-role" ? getRoleById(roleId) : null;
            const Icon = role ? ICON_MAP[role.icon] || Users : Users;
            const colors = role ? ROLE_COLORS[role.color] : { bg: "bg-muted", text: "text-muted-foreground" };

            return (
              <div key={roleId} className="bg-card rounded-2xl border border-border overflow-hidden">
                {/* Role Header */}
                <div className={cn("flex items-center gap-3 px-4 py-2", role ? colors.bg : "bg-muted")}>
                  <Icon className={cn("w-4 h-4", role ? "text-white" : "text-muted-foreground")} />
                  <span className={cn("font-medium text-sm", role ? "text-white" : "text-foreground")}>
                    {role?.name || "Generales"}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-2 font-medium text-foreground text-sm min-w-[180px]">
                          Hábito
                        </th>
                        {weekDays.map((day) => {
                          const isToday = isSameDay(day, new Date());
                          const isSelected = format(day, "yyyy-MM-dd") === selectedDate;
                          return (
                            <th 
                              key={day.toISOString()} 
                              className={cn(
                                "text-center px-2 py-2 font-medium min-w-[45px]",
                                isToday && "bg-primary/10",
                                isSelected && "bg-accent/20"
                              )}
                            >
                              <div className="text-xs text-muted-foreground uppercase">
                                {format(day, "EEE", { locale: es })}
                              </div>
                              <div className={cn(
                                "text-sm",
                                isToday ? "text-primary font-bold" : "text-foreground"
                              )}>
                                {format(day, "d")}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {habits.map((habit) => (
                        <tr key={habit.id} className="hover:bg-muted/30">
                          <td className="px-4 py-2">
                            <span className="text-foreground text-sm">{habit.name}</span>
                          </td>
                          {weekDays.map((day) => {
                            const dayStr = format(day, "yyyy-MM-dd");
                            const log = logsMap[habit.id]?.[dayStr];
                            const statusConfig = log ? STATUS_ICONS[log.status] : null;
                            const isToday = isSameDay(day, new Date());
                            const isSelected = dayStr === selectedDate;
                            
                            return (
                              <td 
                                key={day.toISOString()} 
                                className={cn(
                                  "text-center px-2 py-2",
                                  isToday && "bg-primary/10",
                                  isSelected && "bg-accent/20"
                                )}
                              >
                                <button
                                  onClick={() => handleToggleStatus(habit.id, dayStr, log?.status)}
                                  className={cn(
                                    "w-7 h-7 rounded-lg mx-auto flex items-center justify-center transition-all",
                                    statusConfig 
                                      ? statusConfig.class 
                                      : "border-2 border-dashed border-border hover:border-primary hover:bg-primary/10"
                                  )}
                                >
                                  {statusConfig && <statusConfig.icon className="w-3 h-3" />}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
