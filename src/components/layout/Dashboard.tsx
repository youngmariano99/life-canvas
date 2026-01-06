/**
 * Main Dashboard Layout
 * Central hub with navigation between views
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, Calendar, Target, BookOpen, Menu, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { IdentityView } from "@/components/views/IdentityView";
import { SemesterView } from "@/components/views/SemesterView";
import { DailyView } from "@/components/views/DailyView";
import { DeviationLog } from "@/components/deviations/DeviationLog";
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

const VIEWS = [
  { id: "identity", label: "Identidad", icon: Compass, description: "Visión y Misión" },
  { id: "semester", label: "Roadmap", icon: Calendar, description: "Plan Semestral" },
  { id: "daily", label: "Ejecución", icon: Target, description: "La Represa" },
  { id: "deviations", label: "Aprendizajes", icon: BookOpen, description: "Desvíos" },
] as const;

type ViewType = typeof VIEWS[number]["id"];

export function Dashboard() {
  const { state, setView, resetAll } = useLifeOSContext();
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
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-foreground">Life-OS 2026</h1>
                <p className="text-xs text-muted-foreground">Superhábitos</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {VIEWS.map((view) => {
                const Icon = view.icon;
                const isActive = currentView === view.id;
                return (
                  <button
                    key={view.id}
                    onClick={() => handleViewChange(view.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
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

            {/* Actions */}
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
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

              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1"
          >
            {VIEWS.map((view) => {
              const Icon = view.icon;
              const isActive = currentView === view.id;
              return (
                <button
                  key={view.id}
                  onClick={() => handleViewChange(view.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div>{view.label}</div>
                    <div className="text-xs opacity-70">{view.description}</div>
                  </div>
                </button>
              );
            })}
          </motion.nav>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {currentView === "identity" && <IdentityView />}
          {currentView === "semester" && <SemesterView />}
          {currentView === "daily" && <DailyView />}
          {currentView === "deviations" && <DeviationLog />}
        </motion.div>
      </main>
    </div>
  );
}
