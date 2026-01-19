/**
 * Fitness Area Component
 * Simple tracking for NEAT activities and workouts
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Flame, Dumbbell, ChevronLeft, ChevronRight, X, Clock, Calendar, Activity, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FitnessRoutineCreator } from "./FitnessRoutineCreator";
import { RoutineSelector } from "./RoutineSelector";
import { FitnessActivityType } from "@/types/lifeOS";

export function FitnessArea() {
  const { state, addFitnessActivity, deleteFitnessActivity } = useLifeOSContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isAddingActivity, setIsAddingActivity] = useState(false);

  const [newActivity, setNewActivity] = useState<{
    type: FitnessActivityType;
    name: string;
    duration: string;
    calories: string;
    distance: string;
    notes: string;
  }>({
    type: "workout",
    name: "",
    duration: "",
    calories: "",
    distance: "",
    notes: ""
  });

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get activities for selected date
  const activitiesForDate = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return state.fitnessActivities.filter(a => {
      // Backend returns full ISO string (e.g. 2026-01-19T00:00:00.000Z)
      // We need to match it with the selected YYYY-MM-DD
      const activityDateStr = a.date.split('T')[0];
      return activityDateStr === dateStr;
    });
  }, [selectedDate, state.fitnessActivities]);

  // Get activities summary per day for calendar display
  const activityDays = useMemo(() => {
    const days: Record<string, { neat: number; workout: number }> = {};
    state.fitnessActivities.forEach(activity => {
      const dateKey = activity.date.split('T')[0];
      if (!days[dateKey]) {
        days[dateKey] = { neat: 0, workout: 0 };
      }
      if (activity.type === "neat") {
        days[dateKey].neat++;
      } else {
        days[dateKey].workout++;
      }
    });
    return days;
  }, [state.fitnessActivities]);

  const handleAddActivity = () => {
    if (!newActivity.name.trim() || !selectedDate) return;

    addFitnessActivity({
      type: newActivity.type,
      name: newActivity.name.trim(),
      duration: newActivity.duration ? parseInt(newActivity.duration) : undefined,
      calories: newActivity.calories ? parseInt(newActivity.calories) : undefined,
      distance: newActivity.distance ? parseFloat(newActivity.distance) : undefined,
      notes: newActivity.notes || undefined,
      date: format(selectedDate, "yyyy-MM-dd"),
    });

    setNewActivity({
      type: "workout",
      name: "",
      duration: "",
      calories: "",
      distance: "",
      notes: ""
    });
    setIsAddingActivity(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Área Fitness</h2>
          <p className="text-muted-foreground">Registra tus actividades NEAT y entrenamientos</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Calendar */}
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="icon" onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-lg font-semibold capitalize">
              {format(selectedMonth, "MMMM yyyy", { locale: es })}
            </h3>
            <Button variant="ghost" size="icon" onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Weekday Headers */}
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for offset */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Days */}
            {daysInMonth.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const activities = activityDays[dateStr];
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all relative",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isToday
                        ? "bg-accent/20 text-accent-foreground font-medium"
                        : "hover:bg-muted"
                  )}
                >
                  <span>{format(day, "d")}</span>
                  {activities && (
                    <div className="flex gap-0.5 mt-0.5">
                      {activities.workout > 0 && (
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          isSelected ? "bg-primary-foreground" : "bg-role-athlete"
                        )} />
                      )}
                      {activities.neat > 0 && (
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          isSelected ? "bg-primary-foreground" : "bg-accent"
                        )} />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-role-athlete" />
              <span>Entrenamiento</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span>NEAT</span>
            </div>
          </div>
        </div>

        {/* Selected Day Panel */}
        <div className="bg-card rounded-2xl border border-border p-4 sm:p-6">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold capitalize">
                    {format(selectedDate, "EEEE d", { locale: es })}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {format(selectedDate, "MMMM yyyy", { locale: es })}
                  </p>
                </div>
                <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Agregar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Registrar Actividad
                      </DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue="manual" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="manual">Registro Manual</TabsTrigger>
                        <TabsTrigger value="routines">Usar Rutina</TabsTrigger>
                      </TabsList>

                      <TabsContent value="manual" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Tipo</label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={newActivity.type === "workout" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setNewActivity(prev => ({ ...prev, type: "workout" }))}
                              >
                                <Dumbbell className="w-4 h-4 mr-2" />
                                Entrenamiento
                              </Button>
                              <Button
                                type="button"
                                variant={newActivity.type === "neat" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setNewActivity(prev => ({ ...prev, type: "neat" }))}
                              >
                                <Footprints className="w-4 h-4 mr-2" />
                                NEAT
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Duración (min)</label>
                            <Input
                              type="number"
                              value={newActivity.duration}
                              onChange={(e) => setNewActivity(prev => ({ ...prev, duration: e.target.value }))}
                              placeholder="0"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Calorías (kcal)</label>
                            <Input
                              type="number"
                              value={newActivity.calories}
                              onChange={(e) => setNewActivity(prev => ({ ...prev, calories: e.target.value }))}
                              placeholder="0"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Distancia ({newActivity.type === 'neat' ? 'pasos' : 'km'})</label>
                            <Input
                              type="number"
                              value={newActivity.distance}
                              onChange={(e) => setNewActivity(prev => ({ ...prev, distance: e.target.value }))}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Nombre / Título</label>
                          <Input
                            value={newActivity.name}
                            onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Correr, Crossfit, Caminata..."
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Notas / Detalles</label>
                          <Textarea
                            value={newActivity.notes}
                            onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Detalles del entrenamiento..."
                            className="h-24"
                          />
                        </div>

                        <Button onClick={handleAddActivity} className="w-full">
                          Guardar Actividad
                        </Button>
                      </TabsContent>

                      <TabsContent value="routines" className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium text-muted-foreground">Mis Rutinas</h3>
                          <FitnessRoutineCreator />
                        </div>

                        <RoutineSelector onSelect={(routine) => {
                          // Formatter for different types
                          let formattedContent = "";

                          if (routine.rounds) {
                            formattedContent += `Rondas Totales: ${routine.rounds}\n\n`;
                          }

                          formattedContent += routine.content.map(item => {
                            if (routine.structureType === 'sets_reps') {
                              return `- ${item.name}: ${item.sets} series x ${item.reps}`;
                            } else if (routine.structureType === 'rounds') {
                              return `- ${item.name}: ${item.target}`;
                            } else if (routine.structureType === 'intervals') {
                              return `- ${item.sets}x: ${item.work}/${item.rest} ${item.exercise ? `(${item.exercise})` : ''}`;
                            } else if (routine.structureType === 'time') {
                              return `Tiempo Objetivo: ${item.targetTime}`;
                            } else if (routine.structureType === 'distance') {
                              return `Distancia Objetivo: ${item.targetDistance}`;
                            }
                            return typeof item === 'string' ? item : JSON.stringify(item);
                          }).join('\n');

                          const oneLinerItem = routine.content[0] as any;
                          const targetTime = (routine.structureType === 'time' || routine.structureType === 'distance') ? oneLinerItem?.targetTime : undefined;
                          const targetDistance = (routine.structureType === 'distance') ? oneLinerItem?.targetDistance : undefined;

                          // Auto-fill from routine
                          setNewActivity({
                            ...newActivity,
                            type: routine.type === 'cardio' ? 'neat' : 'workout',
                            name: routine.name,
                            notes: `Estructura: ${routine.structureType.replace('_', ' ')}\n${formattedContent}`,
                            duration: targetTime?.replace(/[^0-9]/g, '') || "", // Try to extract just numbers if it's simpler, else leave user to edit
                          });

                          // Switch tab back to manual
                          const tabsTrigger = document.querySelector('[data-state="inactive"][value="manual"]') as HTMLElement;
                          if (tabsTrigger) tabsTrigger.click();
                        }} />
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Activities List */}
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {activitiesForDate.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <Dumbbell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Sin actividades registradas</p>
                    </motion.div>
                  ) : (
                    activitiesForDate.map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="group flex items-start gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          activity.type === "workout" ? "bg-role-athlete" : "bg-accent"
                        )}>
                          {activity.type === "workout" ? (
                            <Dumbbell className="w-4 h-4 text-white" />
                          ) : (
                            <Flame className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.name}</p>
                          {activity.duration && (
                            <p className="text-xs text-muted-foreground">{activity.duration} min</p>
                          )}
                          {activity.notes && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">{activity.notes}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteFitnessActivity(activity.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Selecciona un día</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}