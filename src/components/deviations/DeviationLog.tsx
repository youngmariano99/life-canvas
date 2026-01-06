/**
 * Deviation Log Component
 * Track deviations as learning points, not failures
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { BookOpen, Plus, Lightbulb, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DeviationLog() {
  const { state, addDeviation } = useLifeOSContext();
  const [isAdding, setIsAdding] = useState(false);
  const [whatHappened, setWhatHappened] = useState("");
  const [adjustment, setAdjustment] = useState("");
  const [lesson, setLesson] = useState("");

  const handleAddDeviation = () => {
    if (!whatHappened.trim() || !adjustment.trim()) return;
    addDeviation({
      date: new Date().toISOString().split('T')[0],
      whatHappened: whatHappened.trim(),
      adjustmentAction: adjustment.trim(),
      lesson: lesson.trim() || undefined,
    });
    setWhatHappened("");
    setAdjustment("");
    setLesson("");
    setIsAdding(false);
  };

  const sortedDeviations = [...state.deviations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Puntos de Aprendizaje</h2>
          <p className="text-muted-foreground">
            Los desvíos no son fracasos, son oportunidades de mejora
          </p>
        </div>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="w-4 h-4" />
              Registrar Desvío
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                Nuevo Punto de Aprendizaje
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  ¿Qué pasó?
                </label>
                <Textarea
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  placeholder="Describe el desvío sin juzgarte..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  ¿Cuál es la acción de ajuste?
                </label>
                <Textarea
                  value={adjustment}
                  onChange={(e) => setAdjustment(e.target.value)}
                  placeholder="¿Qué harás diferente la próxima vez?"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Lección aprendida (opcional)
                </label>
                <Input
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                  placeholder="Una frase que resuma el aprendizaje"
                />
              </div>
              <Button 
                onClick={handleAddDeviation} 
                disabled={!whatHappened.trim() || !adjustment.trim()} 
                className="w-full"
              >
                Guardar Aprendizaje
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
      {sortedDeviations.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Sin desvíos registrados</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Cuando algo no salga como esperabas, registra el desvío aquí para convertirlo en un aprendizaje.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDeviations.map((deviation, index) => (
            <motion.div
              key={deviation.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-soft"
            >
              {/* Date */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {format(parseISO(deviation.date), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
                {deviation.lesson && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    💡 Con lección
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* What happened */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    ¿Qué pasó?
                  </div>
                  <p className="text-muted-foreground pl-6">
                    {deviation.whatHappened}
                  </p>
                </div>

                {/* Adjustment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ArrowRight className="w-4 h-4 text-success" />
                    Acción de ajuste
                  </div>
                  <p className="text-muted-foreground pl-6">
                    {deviation.adjustmentAction}
                  </p>
                </div>
              </div>

              {/* Lesson */}
              {deviation.lesson && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-start gap-2 bg-accent/10 rounded-xl p-4">
                    <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-foreground font-medium italic">
                      "{deviation.lesson}"
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
