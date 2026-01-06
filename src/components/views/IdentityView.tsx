/**
 * Identity View - "El Norte"
 * Displays Vision, Mission, and Roles as the strategic foundation
 */

import { motion } from "framer-motion";
import { Telescope, Compass, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users, Target } from "lucide-react";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { ROLE_COLORS } from "@/types/lifeOS";
import { RoleCard } from "@/components/roles/RoleCard";
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

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Tu Norte Estratégico</h2>
        <p className="text-muted-foreground">La base que guía todas tus decisiones</p>
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
        <h3 className="text-lg font-semibold text-foreground">Roles de Vida</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              />
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
