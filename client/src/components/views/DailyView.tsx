/**
 * Daily View - "La Represa"
 * Daily execution with stone tracking, habits, and activities by role
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, addDays, subDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Gem, Check, Calendar, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users, Eye, EyeOff, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { cn } from "@/lib/utils";
import { HabitTracker } from "@/components/habits/HabitTracker";
import { ROLE_COLORS } from "@/types/lifeOS";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users,
};

export function DailyView() {
  const {
    state,
    getDailyStone,
    setDailyStone,
    completeDailyStone,
    getActivitiesForDate,
    getRoleById,
    updateProjectActivity,
    toggleShowPastItems,
    setView,
    setActivePomodoroTaskId
  } = useLifeOSContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stoneInput, setStoneInput] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dailyStone = getDailyStone(dateStr);
  const isToday = isSameDay(selectedDate, new Date());

  // Weekly Rock
  const weeklyRockNote = useMemo(() => {
    return state.notes.find(n => n.tags.includes("weekly-rock"));
  }, [state.notes]);

  // Week days for navigation
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get activities for this date, grouped by role
  const activitiesForDate = useMemo(() => {
    // Only show activities up to today (Past or Present), hide Future totally as requested in Sprint 8
    const dateToCheck = parseISO(dateStr);
    const today = new Date();
    // Exclude strictly future days from being planned/seen in this view
    if (dateToCheck > today && !isSameDay(dateToCheck, today)) {
      return {};
    }

    const activities = getActivitiesForDate(dateStr);

    // Filter by role if selected
    const filtered = selectedRoleFilter === "all"
      ? activities
      : activities.filter(a => a.roleId === selectedRoleFilter);

    // Group by role
    const grouped: Record<string, typeof activities> = {};

    filtered.forEach(activity => {
      const roleId = activity.roleId || "no-role";
      if (!grouped[roleId]) grouped[roleId] = [];
      grouped[roleId].push(activity);
    });

    return grouped;
  }, [dateStr, getActivitiesForDate, selectedRoleFilter]);

  const hasActivities = Object.keys(activitiesForDate).length > 0;

  const handleSetStone = () => {
    if (!stoneInput.trim()) return;
    setDailyStone(dateStr, stoneInput.trim());
    setStoneInput("");
  };

  const handleToggleStone = () => {
    if (dailyStone) {
      completeDailyStone(dateStr, !dailyStone.completed);
    }
  };

  const handleToggleActivity = (activityId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Completada" ? "Por hacer" : "Completada";
    updateProjectActivity(activityId, { status: newStatus });
  };

  const handleStartPomodoro = (activityTitle: string) => {
    setActivePomodoroTaskId(activityTitle);
    setView("pomodoro");
  };

  return (
    <div className="space-y-8">
      {/* Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground capitalize">
            {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
          </h2>
          <p className="text-muted-foreground">
            {isToday ? "Hoy" : format(selectedDate, "yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10"
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant={isToday ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDate(new Date())}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Week Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weekDays.map((day) => {
          const dayStone = getDailyStone(format(day, "yyyy-MM-dd"));
          const isSelected = isSameDay(day, selectedDate);
          const isDayToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex flex-col items-center min-w-[70px] py-4 px-3 rounded-xl transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-card"
                  : "bg-card hover:bg-secondary border border-border",
                isDayToday && !isSelected && "ring-2 ring-accent ring-offset-2 ring-offset-background"
              )}
            >
              <span className={cn(
                "text-xs font-medium uppercase",
                isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {format(day, "EEE", { locale: es })}
              </span>
              <span className="text-lg font-semibold mt-0.5">
                {format(day, "d")}
              </span>
              {dayStone && (
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1",
                  dayStone.completed
                    ? "bg-success"
                    : isSelected ? "bg-primary-foreground/50" : "bg-accent"
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* The Weekly Rock Compass */}
      {weeklyRockNote && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-4 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-primary/80 mb-1">Brújula de la Semana</h4>
            <p className="text-foreground font-medium sm:text-lg">"{weeklyRockNote.content}"</p>
          </div>
        </motion.div>
      )}

      {/* Daily Stone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-2xl p-6 border-2",
          dailyStone?.completed
            ? "bg-success/10 border-success/30"
            : "bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30"
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
            dailyStone?.completed ? "bg-success" : "stone-highlight"
          )}>
            <Gem className={cn("w-7 h-7", dailyStone?.completed ? "text-white" : "text-accent-foreground")} />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground">La Piedra del Día</h3>
              <p className="text-sm text-muted-foreground">
                El objetivo más importante. Si solo haces una cosa hoy, que sea esta.
              </p>
            </div>

            {dailyStone ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleStone}
                  disabled={state.isReadOnly}
                  className={cn(
                    "w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0",
                    dailyStone.completed
                      ? "bg-success border-success text-white"
                      : "border-accent hover:bg-accent/20",
                    state.isReadOnly && "cursor-not-allowed opacity-50"
                  )}
                >
                  {dailyStone.completed && <Check className="w-6 h-6" />}
                </button>
                <span className={cn(
                  "text-lg font-medium leading-tight",
                  dailyStone.completed && "line-through text-muted-foreground"
                )}>
                  {dailyStone.title}
                </span>
              </div>
            ) : (
              !state.isReadOnly && (
                <div className="flex gap-2">
                  <Input
                    value={stoneInput}
                    onChange={(e) => setStoneInput(e.target.value)}
                    placeholder="¿Cuál es tu piedra hoy?"
                    className="flex-1 h-12 text-base"
                    onKeyDown={(e) => e.key === "Enter" && handleSetStone()}
                  />
                  <Button onClick={handleSetStone} disabled={!stoneInput.trim()} size="lg" className="px-6">
                    Establecer
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* Daily Activities by Role */}
      {hasActivities && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Actividades del Día</h3>
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
          </div>

          <div className="space-y-4">
            {Object.entries(activitiesForDate).map(([roleId, activities]) => {
              const role = roleId !== "no-role" ? getRoleById(roleId) : null;
              const Icon = role ? ICON_MAP[role.icon] || Users : Users;
              const colors = role ? ROLE_COLORS[role.color] : { bg: "bg-muted", text: "text-muted-foreground" };

              return (
                <div key={roleId} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className={cn("flex items-center gap-3 px-4 py-3", colors.bg)}>
                    <Icon className="w-5 h-5 text-white" />
                    <span className="font-medium text-white">{role?.name || "Sin rol"}</span>
                    <span className="text-white/70 text-sm ml-auto">
                      {activities.length} actividad{activities.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <div className="divide-y divide-border">
                    {activities.map((activity) => {
                      const isCompleted = activity.status === "Completada";
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center gap-4 px-4 py-4 hover:bg-muted/30 transition-colors group"
                        >
                          <button
                            disabled={state.isReadOnly}
                            onClick={() => !state.isReadOnly && handleToggleActivity(activity.id, activity.status)}
                            className={cn(
                              "w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0",
                              isCompleted
                                ? "bg-success border-success text-white"
                                : "border-border hover:border-primary",
                              state.isReadOnly && "cursor-not-allowed opacity-50"
                            )}
                          >
                            {isCompleted && <Check className="w-5 h-5" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <span className={cn(
                              "block truncate transition-colors cursor-pointer",
                              isCompleted ? "line-through text-muted-foreground" : "text-foreground font-medium"
                            )}
                              onClick={() => !state.isReadOnly && handleToggleActivity(activity.id, activity.status)}>
                              {activity.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 opacity-50 sm:opacity-100 sm:group-hover:opacity-100 transition-opacity">
                            {!isCompleted && !state.isReadOnly && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/20 bg-primary/10"
                                title="Iniciar Foco con Pomodoro"
                                onClick={() => handleStartPomodoro(activity.title)}
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                            )}
                            <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-1 rounded hidden sm:inline-block">
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Habit Tracker */}
      <HabitTracker selectedDate={dateStr} readOnly={state.isReadOnly} compact={true} />
    </div>
  );
}
