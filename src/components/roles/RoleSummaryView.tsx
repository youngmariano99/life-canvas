/**
 * Role Summary View
 * Shows daily summary for a specific role: activities, habits, upcoming goals
 */

import { useMemo } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  X, Check, Target, Calendar, Repeat, FolderKanban,
  GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Role, ROLE_COLORS } from "@/types/lifeOS";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users,
};

interface RoleSummaryViewProps {
  role: Role;
  onClose: () => void;
}

export function RoleSummaryView({ role, onClose }: RoleSummaryViewProps) {
  const { 
    state, 
    getGoalsByRole, 
    getHabitsByRole, 
    getActivitiesForDate,
    getHabitLogsForDate,
    logHabit,
    updateProjectActivity
  } = useLifeOSContext();

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
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/70 hover:text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
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
                        onClick={() => handleToggleActivity(activity.id, activity.status)}
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
                          isCompleted 
                            ? "bg-success border-success text-white" 
                            : "border-border hover:border-primary"
                        )}
                      >
                        {isCompleted && <Check className="w-3 h-3" />}
                      </button>
                      <span className={cn(
                        "text-sm flex-1",
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
              <div className="flex items-center gap-2 mb-3">
                <Repeat className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm text-foreground">Hábitos</h3>
              </div>
              <div className="space-y-2">
                {roleHabits.map((habit) => {
                  const log = todayHabitLogs.find(l => l.habitId === habit.id);
                  const isCompleted = log?.status === "completed";
                  return (
                    <div 
                      key={habit.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <button
                        onClick={() => handleToggleHabit(habit.id)}
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0",
                          isCompleted 
                            ? "bg-success border-success text-white" 
                            : "border-border hover:border-primary"
                        )}
                      >
                        {isCompleted && <Check className="w-3 h-3" />}
                      </button>
                      <span className={cn(
                        "text-sm flex-1",
                        isCompleted && "line-through text-muted-foreground"
                      )}>
                        {habit.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Upcoming Goals */}
          {upcomingGoals.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-semibold text-sm text-foreground">Próximos Objetivos</h3>
              </div>
              <div className="space-y-2">
                {upcomingGoals.map((goal) => (
                  <div key={goal.id} className="p-3 rounded-xl bg-muted/50">
                    <p className="text-sm font-medium">{goal.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        colors.bg,
                        "text-white"
                      )}>
                        Q{goal.quarter}
                      </span>
                      {goal.targetDate && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(goal.targetDate), "d MMM", { locale: es })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

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
      </motion.div>
    </motion.div>
  );
}