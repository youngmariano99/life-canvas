
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, SkipForward, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PomodoroSettings, PomodoroMode } from "@/types/lifeOS";

// Simple Circular Progress Component inline for now if not exists
function CircularTimer({ progress, timeString, mode, status, color }: { progress: number, timeString: string, mode: string, status: string, color: string }) {
    const radius = 120;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg
                height={radius * 2}
                width={radius * 2}
                className="transform -rotate-90"
            >
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset: 0 }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="text-muted/20"
                />
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className={color}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold font-mono tracking-tighter">{timeString}</span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-2">{mode}</span>
                {status === "parsed" && <span className="text-xs text-muted-foreground mt-1">Pausa</span>}
            </div>
        </div>
    );
}

interface PomodoroTimerProps {
    settings: PomodoroSettings;
    onSessionComplete: (duration: number, mode: PomodoroMode) => void;
}

export function PomodoroTimer({ settings, onSessionComplete }: PomodoroTimerProps) {
    const [mode, setMode] = useState<PomodoroMode>("timer"); // 'timer' | 'stopwatch'
    const [timerState, setTimerState] = useState<"idle" | "running" | "paused">("idle");
    const [sessionType, setSessionType] = useState<"work" | "shortBreak" | "longBreak">("work");
    const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
    const [elapsedTime, setElapsedTime] = useState(0); // For stopwatch

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Reset timer when settings change or session type changes
    useEffect(() => {
        if (mode === "timer" && timerState === "idle") {
            let duration = settings.workDuration;
            if (sessionType === "shortBreak") duration = settings.shortBreakDuration;
            if (sessionType === "longBreak") duration = settings.longBreakDuration;
            setTimeLeft(duration * 60);
        }
    }, [settings, sessionType, mode, timerState]);

    const toggleTimer = () => {
        if (timerState === "running") {
            setTimerState("paused");
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else {
            setTimerState("running");
            intervalRef.current = setInterval(() => {
                if (mode === "timer") {
                    setTimeLeft(prev => {
                        if (prev <= 1) {
                            handleComplete();
                            return 0;
                        }
                        return prev - 1;
                    });
                } else {
                    setElapsedTime(prev => prev + 1);
                }
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimerState("idle");
        if (mode === "timer") {
            let duration = settings.workDuration;
            if (sessionType === "shortBreak") duration = settings.shortBreakDuration;
            if (sessionType === "longBreak") duration = settings.longBreakDuration;
            setTimeLeft(duration * 60);
        } else {
            handleComplete(elapsedTime); // Save session on stop for stopwatch? Or just reset? 
            // User requested: "Stop when I finish activity". So stop = complete.
            setElapsedTime(0);
        }
    };

    const handleComplete = (actualDurationSecs?: number) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimerState("idle");

        // Play sound
        if (settings.soundEnabled) {
            const audio = new Audio('/sounds/bell.mp3'); // Need to add asset
            audio.play().catch(e => console.log("Audio play failed", e));
        }

        // Show Notification
        if (settings.notificationsEnabled && "Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification("Life-OS Pomodoro", {
                    body: "¡Sesión terminada!",
                    icon: "/favicon.ico" // assuming favicon exists
                });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification("Life-OS Pomodoro", {
                            body: "¡Sesión terminada!"
                        });
                    }
                });
            }
        }

        const durationMin = actualDurationSecs ? Math.ceil(actualDurationSecs / 60) : (
            sessionType === "work" ? settings.workDuration :
                sessionType === "shortBreak" ? settings.shortBreakDuration :
                    settings.longBreakDuration
        );

        // Only log work sessions
        if (sessionType === "work" || mode === "stopwatch") {
            onSessionComplete(durationMin, mode);
        }

        // Auto-switch for timer mode
        if (mode === "timer") {
            if (sessionType === "work") {
                setSessionType("shortBreak"); // Simple logic for now, could be smarter with cycles
            } else {
                setSessionType("work");
            }
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        if (mode === "stopwatch") return 100; // Always full for stopwatch or pulsing?
        const total = sessionType === "work" ? settings.workDuration * 60 :
            sessionType === "shortBreak" ? settings.shortBreakDuration * 60 :
                settings.longBreakDuration * 60;
        return ((total - timeLeft) / total) * 100;
    };

    const getColor = () => {
        if (mode === "stopwatch") return "text-blue-500";
        if (sessionType === "work") return "text-primary";
        return "text-green-500"; // Break
    };

    return (
        <div className="flex flex-col items-center space-y-8 p-6">
            {/* Mode Toggles */}
            <div className="flex p-1 bg-muted rounded-full">
                <button
                    onClick={() => { setMode("timer"); setTimerState("idle"); }}
                    className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", mode === "timer" ? "bg-background shadow-sm" : "text-muted-foreground")}
                >
                    Temporizador
                </button>
                <button
                    onClick={() => { setMode("stopwatch"); setTimerState("idle"); }}
                    className={cn("px-4 py-2 rounded-full text-sm font-medium transition-all", mode === "stopwatch" ? "bg-background shadow-sm" : "text-muted-foreground")}
                >
                    Modo Libre
                </button>
            </div>

            {/* Timer Display */}
            <CircularTimer
                progress={getProgress()}
                timeString={formatTime(mode === "timer" ? timeLeft : elapsedTime)}
                mode={mode === "timer" ? (sessionType === "work" ? "Enfoque" : "Descanso") : "Libre"}
                status={timerState}
                color={getColor()}
            />

            {/* Controls */}
            <div className="flex items-center gap-6">
                {timerState !== "idle" && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full border-2"
                        onClick={stopTimer}
                        title={mode === "stopwatch" ? "Terminar y Guardar" : "Reiniciar"}
                    >
                        {mode === "stopwatch" ? <Square className="fill-current w-5 h-5" /> : <RotateCcw className="w-5 h-5" />}
                    </Button>
                )}

                <Button
                    size="icon"
                    className="h-20 w-20 rounded-full shadow-xl text-white"
                    onClick={toggleTimer}
                >
                    {timerState === "running" ? (
                        <Pause className="w-8 h-8 fill-current" />
                    ) : (
                        <Play className="w-8 h-8 fill-current ml-1" />
                    )}
                </Button>

                {mode === "timer" && timerState !== "idle" && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-full border-2"
                        onClick={() => handleComplete()}
                        title="Saltar"
                    >
                        <SkipForward className="w-5 h-5" />
                    </Button>
                )}
            </div>
        </div>
    );
}
