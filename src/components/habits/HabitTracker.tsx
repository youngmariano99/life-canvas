/**
 * Habit Tracker Component
 * Weekly grid for habit tracking inspired by Superhábitos planilla
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Check, X, Minus, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { HabitLog } from "@/types/lifeOS";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HabitTrackerProps {
  selectedDate: string;
}

const STATUS_ICONS = {
  completed: { icon: Check, class: "bg-success text-white", label: "Cumplí" },
  missed: { icon: X, class: "bg-destructive text-white", label: "No cumplí" },
  day_off: { icon: Minus, class: "bg-muted text-muted-foreground", label: "Día libre" },
  other: { icon: MoreHorizontal, class: "bg-warning text-white", label: "Otros" },
};

export function HabitTracker({ selectedDate }: HabitTrackerProps) {
  const { state, addHabit, logHabit, getHabitLogsForDate } = useLifeOSContext();
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

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

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    addHabit({
      name: newHabitName.trim(),
      frequency: "daily",
    });
    setNewHabitName("");
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

      {/* Habit Grid */}
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
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-foreground min-w-[200px]">
                    Hábito
                  </th>
                  {weekDays.map((day) => {
                    const isToday = isSameDay(day, new Date());
                    const isSelected = format(day, "yyyy-MM-dd") === selectedDate;
                    return (
                      <th 
                        key={day.toISOString()} 
                        className={cn(
                          "text-center px-2 py-3 font-medium min-w-[50px]",
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
                {state.habits.map((habit) => (
                  <tr key={habit.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="text-foreground">{habit.name}</span>
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
                            "text-center px-2 py-3",
                            isToday && "bg-primary/10",
                            isSelected && "bg-accent/20"
                          )}
                        >
                          <button
                            onClick={() => handleToggleStatus(habit.id, dayStr, log?.status)}
                            className={cn(
                              "w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all",
                              statusConfig 
                                ? statusConfig.class 
                                : "border-2 border-dashed border-border hover:border-primary hover:bg-primary/10"
                            )}
                          >
                            {statusConfig && <statusConfig.icon className="w-4 h-4" />}
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
      )}
    </div>
  );
}
