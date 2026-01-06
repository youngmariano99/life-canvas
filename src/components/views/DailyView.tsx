/**
 * Daily View - "La Represa"
 * Daily execution with stone tracking and habit grid
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { format, addDays, subDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Gem, Check, X, Minus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { cn } from "@/lib/utils";
import { HabitTracker } from "@/components/habits/HabitTracker";

export function DailyView() {
  const { state, getDailyStone, setDailyStone, completeDailyStone } = useLifeOSContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stoneInput, setStoneInput] = useState("");

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const dailyStone = getDailyStone(dateStr);
  const isToday = isSameDay(selectedDate, new Date());

  // Week days for navigation
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handleSetStone = () => {
    if (!stoneInput.trim()) return;
    setDailyStone(dateStr, stoneInput.trim());
    setStoneInput("");
  };

  const handleToggleStone = () => {
    if (dailyStone) {
      completeDailyStone(dateStr, !dailyStone.completed);
    }
  };

  return (
    <div className="space-y-8">
      {/* Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground capitalize">
            {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
          </h2>
          <p className="text-muted-foreground">
            {isToday ? "Hoy" : format(selectedDate, "yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(subDays(selectedDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={isToday ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDate(new Date())}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Hoy
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Week Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {weekDays.map((day) => {
          const dayStone = getDailyStone(format(day, "yyyy-MM-dd"));
          const isSelected = isSameDay(day, selectedDate);
          const isDayToday = isSameDay(day, new Date());
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex flex-col items-center min-w-[60px] py-3 px-4 rounded-xl transition-all",
                isSelected 
                  ? "bg-primary text-primary-foreground shadow-card" 
                  : "bg-card hover:bg-secondary border border-border",
                isDayToday && !isSelected && "ring-2 ring-accent ring-offset-2 ring-offset-background"
              )}
            >
              <span className={cn(
                "text-xs font-medium uppercase",
                isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
              )}>
                {format(day, "EEE", { locale: es })}
              </span>
              <span className="text-lg font-semibold mt-0.5">
                {format(day, "d")}
              </span>
              {dayStone && (
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1",
                  dayStone.completed 
                    ? "bg-success" 
                    : isSelected ? "bg-primary-foreground/50" : "bg-accent"
                )} />
              )}
            </button>
          );
        })}
      </div>

      {/* Daily Stone */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-2xl p-6 border-2",
          dailyStone?.completed 
            ? "bg-success/10 border-success/30" 
            : "bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30"
        )}
      >
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
            dailyStone?.completed ? "bg-success" : "stone-highlight"
          )}>
            <Gem className={cn("w-7 h-7", dailyStone?.completed ? "text-white" : "text-accent-foreground")} />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground">La Piedra del Día</h3>
              <p className="text-sm text-muted-foreground">
                El objetivo más importante. Si solo haces una cosa hoy, que sea esta.
              </p>
            </div>

            {dailyStone ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleStone}
                  className={cn(
                    "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all",
                    dailyStone.completed 
                      ? "bg-success border-success text-white" 
                      : "border-accent hover:bg-accent/20"
                  )}
                >
                  {dailyStone.completed && <Check className="w-4 h-4" />}
                </button>
                <span className={cn(
                  "text-lg font-medium",
                  dailyStone.completed && "line-through text-muted-foreground"
                )}>
                  {dailyStone.title}
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={stoneInput}
                  onChange={(e) => setStoneInput(e.target.value)}
                  placeholder="¿Cuál es tu piedra hoy?"
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSetStone()}
                />
                <Button onClick={handleSetStone} disabled={!stoneInput.trim()}>
                  Establecer
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Habit Tracker */}
      <HabitTracker selectedDate={dateStr} />
    </div>
  );
}
