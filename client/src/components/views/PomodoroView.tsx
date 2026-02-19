
import { useState } from "react";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { SessionLogModal } from "@/components/pomodoro/SessionLogModal";
import { PomodoroHistory } from "@/components/pomodoro/PomodoroHistory";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { PomodoroMode, PomodoroSession } from "@/types/lifeOS";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BrainCircuit, Settings, Dumbbell } from "lucide-react";
import { PomodoroSettingsDialog } from "@/components/pomodoro/PomodoroSettingsDialog";
import { Button } from "@/components/ui/button";
import { ActivePauseModal } from "@/components/pomodoro/ActivePauseModal";
import { ActivePauseManager } from "@/components/pomodoro/ActivePauseManager";

export function PomodoroView() {
    const { state, addPomodoroSession, deletePomodoroSession, updatePomodoroSettings } = useLifeOSContext();
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isActivePauseOpen, setIsActivePauseOpen] = useState(false);
    const [isRoutineManagerOpen, setIsRoutineManagerOpen] = useState(false);
    const [completedSession, setCompletedSession] = useState<{ duration: number, mode: PomodoroMode } | null>(null);

    const handleSessionComplete = (duration: number, mode: PomodoroMode) => {
        setCompletedSession({ duration, mode });
        setIsLogModalOpen(true);
    };

    const handleSaveSession = (sessionData: Partial<PomodoroSession>) => {
        if (completedSession) {
            addPomodoroSession(sessionData as any);
            setIsLogModalOpen(false);
            // Trigger Active Pause if it was a work session
            if (completedSession.mode === "timer" || completedSession.mode === "stopwatch") {
                setIsActivePauseOpen(true);
            }
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Modo Enfoque</h2>
                        <p className="text-muted-foreground text-sm">Gestiona tu atención y energía</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsRoutineManagerOpen(true)}>
                        <Dumbbell className="w-4 h-4 mr-2" />
                        Rutinas
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="w-5 h-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="timer" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="timer">Temporizador</TabsTrigger>
                    <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="timer">
                    <div className="bg-card rounded-2xl border shadow-sm border-border">
                        <PomodoroTimer
                            settings={state.pomodoroSettings}
                            onSessionComplete={handleSessionComplete}
                        />
                    </div>

                    {/* Quick Stats or Today's summary could go here */}
                    <div className="mt-6 text-center text-muted-foreground text-sm">
                        <p>Sesiones de hoy: {state.pomodoroSessions.filter(s => {
                            const today = new Date().toISOString().split('T')[0];
                            return s.createdAt.startsWith(today);
                        }).length}</p>
                    </div>
                </TabsContent>

                <TabsContent value="history">
                    <div className="bg-card rounded-2xl border shadow-sm border-border p-4">
                        <PomodoroHistory
                            sessions={state.pomodoroSessions}
                            roles={state.roles}
                            projects={state.projects}
                            onDelete={deletePomodoroSession}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            <SessionLogModal
                open={isLogModalOpen}
                onOpenChange={setIsLogModalOpen}
                sessionData={completedSession}
                onSave={handleSaveSession}
                roles={state.roles}
                projects={state.projects}
            />

            <ActivePauseModal
                open={isActivePauseOpen}
                onOpenChange={setIsActivePauseOpen}
                onComplete={() => setIsActivePauseOpen(false)}
                onSkip={() => setIsActivePauseOpen(false)}
            />

            <ActivePauseManager
                open={isRoutineManagerOpen}
                onOpenChange={setIsRoutineManagerOpen}
            />

            <PomodoroSettingsDialog
                open={isSettingsOpen}
                onOpenChange={setIsSettingsOpen}
                settings={state.pomodoroSettings}
                onSave={updatePomodoroSettings}
            />
        </div>
    );
}
