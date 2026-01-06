/**
 * Role Card Component
 * Visual card showing role progress
 */

import { motion } from "framer-motion";
import { GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users } from "lucide-react";
import { Role, ROLE_COLORS } from "@/types/lifeOS";
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

interface RoleCardProps {
  role: Role;
  goalsCount: number;
  progress: number;
  delay?: number;
}

export function RoleCard({ role, goalsCount, progress, delay = 0 }: RoleCardProps) {
  const Icon = ICON_MAP[role.icon] || Users;
  const colors = ROLE_COLORS[role.color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="group bg-card rounded-2xl border border-border p-5 shadow-soft hover:shadow-card transition-all duration-300"
    >
      {/* Icon & Name */}
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
          colors.bg
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{role.name}</h4>
          <p className="text-sm text-muted-foreground">
            {goalsCount} objetivo{goalsCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Progreso</span>
          <span className={cn("font-medium", colors.text)}>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2, ease: "easeOut" }}
            className={cn("h-full rounded-full", colors.bg)}
          />
        </div>
      </div>
    </motion.div>
  );
}
