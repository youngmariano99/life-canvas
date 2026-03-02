/**
 * Event Calendar Component
 * Drag & drop calendar with color-coded events and custom tags
 */

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format, parseISO, startOfWeek, endOfWeek, addDays, isSameDay,
  startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths,
  addWeeks, subWeeks, isWithinInterval, isSameMonth
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Plus, ChevronLeft, ChevronRight, X, Calendar, Clock,
  Gift, Bell, Stethoscope, GraduationCap, Flag, User, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarEventTag, EVENT_TAG_COLORS } from "@/types/lifeOS";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAG_ICONS: Record<CalendarEventTag, React.ComponentType<{ className?: string }>> = {
  birthday: Gift,
  reminder: Bell,
  appointment: Stethoscope,
  exam: GraduationCap,
  deadline: Flag,
  personal: User,
  custom: Tag,
};

const TAG_LABELS: Record<CalendarEventTag, string> = {
  birthday: "Cumpleaños",
  reminder: "Recordatorio",
  appointment: "Cita",
  exam: "Examen/Parcial",
  deadline: "Fecha límite",
  personal: "Personal",
  custom: "Personalizado",
};

type ViewMode = "week" | "month";

interface EventCalendarProps {
  readOnly?: boolean;
}

export function EventCalendar({ readOnly = false }: EventCalendarProps) {
  const { state, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useLifeOSContext();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    tag: "personal" as CalendarEventTag,
    customTagLabel: "",
    description: "",
  });
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  // Calculate dates based on view mode
  const { startDate, endDate, days } = useMemo(() => {
    if (viewMode === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return {
        startDate: start,
        endDate: end,
        days: Array.from({ length: 7 }, (_, i) => addDays(start, i))
      };
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      return {
        startDate: start,
        endDate: end,
        days: eachDayOfInterval({ start, end })
      };
    }
  }, [currentDate, viewMode]);

  // Get events for current view
  const eventsForView = useMemo(() => {
    return state.calendarEvents.filter(event => {
      const rawDate = event.date || new Date().toISOString();
      // Fix Timezone issue: Treat the date string as local date (YYYY-MM-DD)
      // ignoring the time component/timezone valid for UTC
      const dateStr = rawDate.split('T')[0];
      const [year, month, day] = dateStr.split('-').map(Number);
      const eventDate = new Date(year, month - 1, day); // Local midnight

      return isWithinInterval(eventDate, { start: startDate, end: endDate });
    });
  }, [state.calendarEvents, startDate, endDate]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, typeof state.calendarEvents> = {};
    eventsForView.forEach(event => {
      // Compatibility: Backend returns startDate, Frontend expects date. 
      // We extract the YYYY-MM-DD part from ISO string if needed.
      const rawDate = event.date;
      if (!rawDate) return;

      const dateKey = rawDate.split('T')[0]; // Ensure we get YYYY-MM-DD

      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [eventsForView]);

  const handleNavigate = (direction: "prev" | "next") => {
    if (viewMode === "week") {
      setCurrentDate(direction === "prev" ? subWeeks(currentDate, 1) : addWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) return;

    addCalendarEvent({
      title: newEvent.title.trim(),
      date: newEvent.date,
      time: newEvent.time || undefined,
      tag: newEvent.tag,
      customTagLabel: newEvent.tag === "custom" ? newEvent.customTagLabel : undefined,
      description: newEvent.description || undefined,
    });

    setNewEvent({ title: "", date: "", time: "", tag: "personal", customTagLabel: "", description: "" });
    setIsAddingEvent(false);
    setSelectedDate(null);
  };

  const handleDragStart = (eventId: string) => {
    setDraggedEventId(eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    if (draggedEventId) {
      updateCalendarEvent(draggedEventId, { date: dateStr });
      setDraggedEventId(null);
    }
  };

  const openAddEventForDate = (date: Date) => {
    setNewEvent(prev => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    setSelectedDate(format(date, "yyyy-MM-dd"));
    setIsAddingEvent(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => handleNavigate("prev")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h3 className="text-lg font-semibold min-w-[150px] sm:min-w-[180px] text-center capitalize">
            {viewMode === "week"
              ? `${format(startDate, "d MMM", { locale: es })} - ${format(endDate, "d MMM yyyy", { locale: es })}`
              : format(currentDate, "MMMM yyyy", { locale: es })
            }
          </h3>
          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => handleNavigate("next")}>
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="sm" className="h-10 px-4 ml-1" onClick={() => setCurrentDate(new Date())}>
            Hoy
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
            </TabsList>
          </Tabs>

          {!readOnly && (
            <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Evento</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Nuevo Evento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título del evento"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-muted-foreground">Fecha</label>
                      <Input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Hora (opcional)</label>
                      <Input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Select
                    value={newEvent.tag}
                    onValueChange={(v) => setNewEvent(prev => ({ ...prev, tag: v as CalendarEventTag }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TAG_LABELS).map(([key, label]) => {
                        const Icon = TAG_ICONS[key as CalendarEventTag];
                        const colors = EVENT_TAG_COLORS[key as CalendarEventTag];
                        return (
                          <SelectItem key={key} value={key}>
                            <span className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", colors.bg)} />
                              {label}
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {newEvent.tag === "custom" && (
                    <Input
                      value={newEvent.customTagLabel}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, customTagLabel: e.target.value }))}
                      placeholder="Etiqueta personalizada"
                    />
                  )}
                  <Textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción (opcional)"
                    rows={2}
                  />
                  <Button onClick={handleAddEvent} disabled={!newEvent.title.trim() || !newEvent.date} className="w-full">
                    Agregar Evento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === "week" ? (
        <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0">
          <div className="grid grid-cols-7 gap-2 min-w-[800px]">
            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDate[dateStr] || [];
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={dateStr}
                  className={cn(
                    "min-h-[140px] sm:min-h-[180px] bg-card rounded-xl border border-border p-2 transition-colors",
                    isToday && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  )}
                  onDragOver={!readOnly ? handleDragOver : undefined}
                  onDrop={!readOnly ? (e) => handleDrop(e, dateStr) : undefined}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase">
                        {format(day, "EEE", { locale: es })}
                      </p>
                      <p className={cn(
                        "text-lg font-semibold",
                        isToday && "text-primary"
                      )}>
                        {format(day, "d")}
                      </p>
                    </div>
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-50 hover:opacity-100"
                        onClick={() => openAddEventForDate(day)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <AnimatePresence mode="popLayout">
                      {dayEvents.slice(0, 4).map((event) => {
                        const eventTag = event.tag || "personal";
                        const Icon = TAG_ICONS[eventTag] || TAG_ICONS.personal;
                        const colors = EVENT_TAG_COLORS[eventTag] || EVENT_TAG_COLORS.personal;
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            draggable={!readOnly}
                            onDragStart={() => !readOnly && handleDragStart(event.id)}
                            className={cn(
                              "group flex items-center gap-1.5 px-2 py-1 rounded-md text-xs transition-colors",
                              !readOnly && "cursor-move",
                              colors.bg,
                              "text-white hover:opacity-90"
                            )}
                          >
                            <Icon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate flex-1">{event.title}</span>
                            {!readOnly && (
                              <button
                                onClick={() => deleteCalendarEvent(event.id)}
                                className="opacity-0 group-hover:opacity-100 hover:bg-white/20 rounded p-0.5"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {dayEvents.length > 4 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 4} más
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for offset */}
            {Array.from({ length: (startDate.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {days.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDate[dateStr] || [];
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={dateStr}
                  className={cn(
                    "aspect-square p-1 rounded-lg transition-colors",
                    !readOnly && "cursor-pointer hover:bg-muted",
                    isToday && "ring-2 ring-primary",
                    !isSameMonth(day, currentDate) && "opacity-40"
                  )}
                  onDragOver={!readOnly ? handleDragOver : undefined}
                  onDrop={!readOnly ? (e) => handleDrop(e, dateStr) : undefined}
                  onClick={() => !readOnly && openAddEventForDate(day)}
                >
                  <p className={cn(
                    "text-xs text-center mb-0.5",
                    isToday && "font-bold text-primary"
                  )}>
                    {format(day, "d")}
                  </p>
                  <div className="flex flex-wrap gap-0.5 justify-center">
                    {dayEvents.slice(0, 3).map((event) => {
                      const eventTag = event.tag || "personal";
                      const colors = EVENT_TAG_COLORS[eventTag] || EVENT_TAG_COLORS.personal;
                      return (
                        <div
                          key={event.id}
                          className={cn("w-1.5 h-1.5 rounded-full", colors.bg)}
                        />
                      )
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tag Legend */}
      <div className="flex flex-wrap gap-3 justify-center text-xs">
        {Object.entries(TAG_LABELS).slice(0, -1).map(([key, label]) => {
          const colors = EVENT_TAG_COLORS[key as CalendarEventTag];
          return (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn("w-2.5 h-2.5 rounded-full", colors.bg)} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}