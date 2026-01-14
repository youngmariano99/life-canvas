/**
 * Role Card Component
 * Visual card showing role progress with optional custom image
 */

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users, ImagePlus } from "lucide-react";
import { Role, ROLE_COLORS } from "@/types/lifeOS";
import { useLifeOSContext } from "@/context/LifeOSContext";
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
  const { updateRole } = useLifeOSContext();
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const Icon = ICON_MAP[role.icon] || Users;
  const colors = ROLE_COLORS[role.color];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for localStorage storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      updateRole(role.id, { imageUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="group bg-card rounded-2xl border border-border shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image Section */}
      {role.imageUrl ? (
        <div className="relative h-24 overflow-hidden">
          <img 
            src={role.imageUrl} 
            alt={role.name}
            className="w-full h-full object-cover"
          />
          <div className={cn("absolute inset-0 bg-gradient-to-t from-black/60 to-transparent")} />
          <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              colors.bg
            )}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-semibold text-white truncate">{role.name}</h4>
          </div>
          {/* Upload overlay on hover */}
          {isHovering && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity"
            >
              <ImagePlus className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      ) : (
        <div 
          className={cn(
            "relative h-16 flex items-center justify-center cursor-pointer transition-colors",
            colors.bg,
            "hover:opacity-90"
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <Icon className="w-6 h-6 text-white" />
          {isHovering && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <ImagePlus className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Content */}
      <div className="p-4">
        {!role.imageUrl && (
          <h4 className="font-semibold text-foreground truncate mb-1">{role.name}</h4>
        )}
        <p className="text-sm text-muted-foreground">
          {goalsCount} objetivo{goalsCount !== 1 ? 's' : ''}
        </p>

        {/* Progress Bar */}
        <div className="mt-3">
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
      </div>
    </motion.div>
  );
}
