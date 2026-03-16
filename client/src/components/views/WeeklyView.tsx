/**
 * Weekly Planning View
 * Projects with Kanban board for activities + Event Calendar
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, startOfWeek, endOfWeek, isWithinInterval, parseISO, addWeeks, subWeeks } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, ChevronLeft, ChevronRight, FolderKanban, Calendar, Target, Eye, EyeOff, X, GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_COLORS } from "@/types/lifeOS";
import { KanbanBoard } from "@/components/weekly/KanbanBoard";
import { EventCalendar } from "@/components/calendar/EventCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyWizard } from "@/components/weekly/WeeklyWizard";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap, Dumbbell, Briefcase, Palette, Heart, Sparkles, Users2, Users,
};

export function WeeklyView() {
  const {
    state,
  } = useLifeOSContext();

  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <WeeklyWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarDays className="w-8 h-8 text-primary" />
            Planificación Semanal
          </h2>
          <p className="text-muted-foreground mt-1">
            Semana del {format(weekStart, "d 'de' MMMM", { locale: es })} al {format(weekEnd, "d 'de' MMMM", { locale: es })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg border border-border">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSelectedWeek(subWeeks(selectedWeek, 1))}
            >
              <ChevronLeft className="h-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-4 font-medium"
              onClick={() => setSelectedWeek(new Date())}
            >
              Esta semana
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSelectedWeek(addWeeks(selectedWeek, 1))}
            >
              <ChevronRight className="h-4 h-4" />
            </Button>
          </div>
          
          {!state.isReadOnly && (
            <Button
              variant="default"
              className="h-11 px-6 gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              onClick={() => setIsWizardOpen(true)}
            >
              <Sparkles className="w-4 h-4" />
              Planificar Semana
            </Button>
          )}
        </div>
      </div>

      {/* Main Content: Just the Calendar */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden min-h-[600px]">
        <EventCalendar readOnly={state.isReadOnly} />
      </div>
    </div>
  );
}
