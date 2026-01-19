/**
 * Wizard Step 3: Life Roles
 * Define up to 7 key life areas
 */

import { useState } from "react";
import { Users, ArrowRight, ArrowLeft, Plus, X, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { RoleColor, ROLE_COLORS } from "@/types/lifeOS";
import { cn } from "@/lib/utils";

interface WizardStep3RolesProps {
  onNext: () => void;
  onBack: () => void;
}

const ROLE_PRESETS: Array<{ name: string; icon: string; color: RoleColor }> = [
  { name: "Estudiante", icon: "GraduationCap", color: "student" },
  { name: "Atleta", icon: "Dumbbell", color: "athlete" },
  { name: "Emprendedor", icon: "Briefcase", color: "entrepreneur" },
  { name: "Creativo", icon: "Palette", color: "creative" },
  { name: "Familia", icon: "Heart", color: "family" },
  { name: "Espiritual", icon: "Sparkles", color: "spiritual" },
  { name: "Social", icon: "Users2", color: "social" },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Dumbbell,
  Briefcase,
  Palette,
  Heart,
  Sparkles,
  Users2,
};

export function WizardStep3Roles({ onNext, onBack }: WizardStep3RolesProps) {
  const { state, addRole, deleteRole } = useLifeOSContext();
  const [customName, setCustomName] = useState("");
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);

  const handleAddPreset = async (preset: typeof ROLE_PRESETS[0]) => {
    if (state.roles.length >= 7) return;
    if (state.roles.some(r => r.name === preset.name)) return;

    setLoadingMsg(`Agregando ${preset.name}...`);
    try {
      await addRole({
        name: preset.name,
        icon: preset.icon,
        color: preset.color,
      });
    } finally {
      setLoadingMsg(null);
    }
  };

  const handleDelete = async (roleId: string, roleName: string) => {
    setLoadingMsg(`Quitando ${roleName}...`);
    try {
      await deleteRole(roleId);
    } finally {
      setLoadingMsg(null);
    }
  };

  const handleAddCustom = async () => {
    if (!customName.trim() || state.roles.length >= 7) return;
    const colors: RoleColor[] = ["student", "athlete", "entrepreneur", "creative", "family", "spiritual", "social"];
    const usedColors = state.roles.map(r => r.color);
    const availableColor = colors.find(c => !usedColors.includes(c)) || "student";

    const name = customName.trim();
    setLoadingMsg(`Creando ${name}...`);
    try {
      await addRole({
        name: name,
        icon: "Users",
        color: availableColor,
      });
      setCustomName("");
    } finally {
      setLoadingMsg(null);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Loading Overlay */}
      {loadingMsg && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <div className="bg-popover text-popover-foreground px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in zoom-in font-medium">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            {loadingMsg}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Tus Roles de Vida</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Define las áreas clave de tu vida (máximo 7). Cada rol representa un aspecto importante a balancear.
          </p>
        </div>
      </div>

      {/* Selected Roles */}
      {state.roles.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Roles seleccionados ({state.roles.length}/7)
          </label>
          <div className="flex flex-wrap gap-2">
            {state.roles.map((role) => {
              const Icon = ICON_MAP[role.icon] || Users;
              const colors = ROLE_COLORS[role.color];
              return (
                <div
                  key={role.id}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white transition-all shadow-sm hover:shadow-md animate-in zoom-in",
                    colors.bg
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {role.name}
                  <button
                    onClick={() => handleDelete(role.id, role.name)}
                    disabled={!!loadingMsg}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preset Roles */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Roles sugeridos
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {ROLE_PRESETS.map((preset) => {
            const Icon = ICON_MAP[preset.icon];
            const isSelected = state.roles.some(r => r.name === preset.name);
            const colors = ROLE_COLORS[preset.color];

            return (
              <button
                key={preset.name}
                onClick={() => handleAddPreset(preset)}
                disabled={isSelected || state.roles.length >= 7 || !!loadingMsg}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2",
                  isSelected
                    ? "bg-muted border-muted cursor-not-allowed opacity-50"
                    : `bg-card hover:bg-secondary border-transparent hover:${colors.border}`
                )}
              >
                <Icon className={cn("w-5 h-5", isSelected ? "text-muted-foreground" : colors.text)} />
                {preset.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Role */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Agregar rol personalizado
        </label>
        <div className="flex gap-2">
          <Input
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Nombre del rol..."
            className="flex-1"
            maxLength={20}
            disabled={state.roles.length >= 7}
          />
          <Button
            variant="secondary"
            onClick={handleAddCustom}
            disabled={!customName.trim() || state.roles.length >= 7}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
        <Button
          onClick={onNext}
          disabled={state.roles.length === 0}
          size="lg"
          className="gap-2"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
