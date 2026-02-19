/**
 * Identity View - "El Norte"
 * Displays Vision, Mission, and Roles as the strategic foundation
 * With expandable role cards that link to RoleSummaryView
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Telescope, Compass, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users, Target, ChevronLeft, Grid3X3, LayoutGrid } from "lucide-react";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { ROLE_COLORS, Role } from "@/types/lifeOS";
import { RoleCard } from "@/components/roles/RoleCard";
import { RoleSummaryView } from "@/components/roles/RoleSummaryView";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export function IdentityView() {
  const { state, getGoalsByRole } = useLifeOSContext();
  const { yearSettings, roles } = state;
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [viewMode, setViewMode] = useState<"compact" | "expanded">("expanded");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // If a role is selected, show the summary view
  if (selectedRole) {
    return (
      <div className="space-y-4">
        {/* Mobile Header with Sticky Back Button */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-2 -mt-4 pt-4">
          <Button
            variant="ghost"
            onClick={() => setSelectedRole(null)}
            className="gap-2 pl-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-lg font-medium">Volver a roles</span>
          </Button>
        </div>
        <RoleSummaryView role={selectedRole} />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Tu Norte Estratégico {state.selectedYear}</h2>
          <p className="text-muted-foreground">La base que guía todas tus decisiones</p>
        </div>

        {/* Year Summary Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm max-w-md mx-auto">
          <div className="flex flex-col items-center p-2 bg-card rounded-lg border border-border">
            <span className="font-bold text-2xl text-primary">{state.goals.length}</span>
            <span className="text-xs text-muted-foreground">Objetivos</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-card rounded-lg border border-border">
            <span className="font-bold text-2xl text-green-500">
              {state.goals.length > 0
                ? Math.round((state.goals.filter(g => g.status === 'completed').length / state.goals.length) * 100)
                : 0}%
            </span>
            <span className="text-xs text-muted-foreground">Progreso</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-card rounded-lg border border-border">
            <span className="font-bold text-2xl text-blue-500">
              {state.habits.length}
            </span>
            <span className="text-xs text-muted-foreground">Hábitos</span>
          </div>
        </div>
      </motion.div>

      {/* Vision & Mission Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Vision Card */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl border border-border p-6 shadow-card"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Telescope className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="font-semibold text-foreground">Visión 2030</h3>
                <p className="text-sm text-muted-foreground">Tu vida en 5 años</p>
              </div>
              <p className="text-foreground/90 leading-relaxed">
                {yearSettings?.vision5Years || "Sin definir"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mission Card */}
        <motion.div
          variants={itemVariants}
          className="bg-card rounded-2xl border border-border p-6 shadow-card"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Compass className="w-6 h-6 text-accent" />
            </div>
            <div className="space-y-3 flex-1">
              <div>
                <h3 className="font-semibold text-foreground">Misión Personal</h3>
                <p className="text-sm text-muted-foreground">Tu propósito central</p>
              </div>
              <p className="text-foreground/90 leading-relaxed italic">
                "{yearSettings?.mission || "Sin definir"}"
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Semester Focus */}
      {(yearSettings?.h1Priority || yearSettings?.h2Priority) && (
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-border p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Prioridades Semestrales</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card/80 rounded-xl p-4">
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                H1 • Ene-Jun
              </span>
              <p className="mt-2 text-foreground">{yearSettings?.h1Priority || "—"}</p>
            </div>
            <div className="bg-card/80 rounded-xl p-4">
              <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                H2 • Jul-Dic
              </span>
              <p className="mt-2 text-foreground">{yearSettings?.h2Priority || "—"}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Roles Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Roles de Vida</h3>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "compact" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewMode("compact")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "expanded" ? "secondary" : "ghost"}
              size="sm"
              className="h-8 px-2"
              onClick={() => setViewMode("expanded")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Haz clic en un rol para ver el resumen diario de actividades
        </p>
        <div className={cn(
          "grid gap-4",
          viewMode === "compact"
            ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {roles.map((role, index) => {
            const goals = getGoalsByRole(role.id);
            const completedGoals = goals.filter(g => g.status === "completed").length;
            const progress = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;

            return (
              <RoleCard
                key={role.id}
                role={role}
                goalsCount={goals.length}
                progress={progress}
                delay={index * 0.05}
                variant={viewMode}
                onClick={() => setSelectedRole(role)}
              />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
