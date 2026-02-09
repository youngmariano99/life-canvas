/**
 * Main Dashboard Layout
 * Central hub with navigation between views
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Calendar, Target, BookOpen, Menu, RotateCcw, Settings, CalendarDays, Dumbbell, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { IdentityView } from "@/components/views/IdentityView";
import { SemesterView } from "@/components/views/SemesterView";
import { DailyView } from "@/components/views/DailyView";
import { WeeklyView } from "@/components/views/WeeklyView";
import { DeviationLog } from "@/components/deviations/DeviationLog";
import { FitnessArea } from "@/components/fitness/FitnessArea";
import { NotesSection } from "@/components/notes/NotesSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { YearSelector } from "./YearSelector";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const VIEWS = [
  { id: "identity", label: "Identidad", icon: Compass, description: "Visión y Roles" },
  { id: "semester", label: "Roadmap", icon: Calendar, description: "Objetivos" },
  { id: "weekly", label: "Semanal", icon: CalendarDays, description: "Proyectos" },
  { id: "daily", label: "Ejecución", icon: Target, description: "Hoy" },
  { id: "fitness", label: "Fitness", icon: Dumbbell, description: "Actividad" },
  { id: "notes", label: "Apuntes", icon: FileText, description: "Notas e ideas" },
  { id: "deviations", label: "Aprendizajes", icon: BookOpen, description: "Desvíos" },
] as const;

export type ViewType = typeof VIEWS[number]["id"];

export function Dashboard() {
  const { state, resetAll, startEditingWizard } = useLifeOSContext();
  const [currentView, setCurrentView] = useState<ViewType>("identity");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">Life-OS {state.selectedYear}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Superhábitos</p>
              </div>
              <YearSelector />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {VIEWS.map((view) => {
                const Icon = view.icon;
                const isActive = currentView === view.id;
                return (
                  <button
                    key={view.id}
                    onClick={() => handleViewChange(view.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {view.label}
                  </button>
                );
              })}
            </nav>

            {/* Actions (Desktop Only for some) */}
            <div className="hidden lg:flex items-center gap-1 sm:gap-2">
              <ThemeToggle />

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground h-8 w-8 sm:h-9 sm:w-9"
                onClick={startEditingWizard}
                title="Modificar planificación"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8 sm:h-9 sm:w-9">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Reiniciar planificación?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará todos tus datos y te llevará al wizard inicial. No se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={resetAll}>
                      Reiniciar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Mobile Header Actions (Minimal) */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 lg:pb-8">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {currentView === "identity" && <IdentityView />}
          {currentView === "semester" && <SemesterView />}
          {currentView === "weekly" && <WeeklyView />}
          {currentView === "daily" && <DailyView />}
          {currentView === "fitness" && <FitnessArea />}
          {currentView === "notes" && <NotesSection />}
          {currentView === "deviations" && <DeviationLog />}
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav currentView={currentView} onViewChange={handleViewChange} />
    </div>
  );
}
