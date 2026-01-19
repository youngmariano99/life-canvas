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
  const { state, addDeviation, updateDeviation, deleteDeviation } = useLifeOSContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [correction, setCorrection] = useState("");
  const [reason, setReason] = useState("");

  const resetForm = () => {
    setTitle("");
    setCorrection("");
    setReason("");
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (deviation: any) => {
    setTitle(deviation.title);
    setCorrection(deviation.correction);
    setReason(deviation.reason || "");
    setEditingId(deviation.id);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!title.trim() || !correction.trim()) return;

    if (editingId) {
      updateDeviation(editingId, {
        title: title.trim(),
        correction: correction.trim(),
        reason: reason.trim() || undefined
      });
    } else {
      addDeviation({
        date: new Date().toISOString().split('T')[0],
        title: title.trim(),
        correction: correction.trim(),
        reason: reason.trim() || undefined,
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este desvío?")) {
      deleteDeviation(id);
    }
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
        <Button onClick={handleOpenAdd} className="gap-1">
          <Plus className="w-4 h-4" />
          Registrar Desvío
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                {editingId ? "Editar Punto de Aprendizaje" : "Nuevo Punto de Aprendizaje"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  ¿Qué pasó?
                </label>
                <Textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Describe el desvío sin juzgarte..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  ¿Cuál es la acción de ajuste?
                </label>
                <Textarea
                  value={correction}
                  onChange={(e) => setCorrection(e.target.value)}
                  placeholder="¿Qué harás diferente la próxima vez?"
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Lección aprendida (opcional)
                </label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Una frase que resuma el aprendizaje"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || !correction.trim()}
                className="w-full"
              >
                {editingId ? "Guardar Cambios" : "Guardar Aprendizaje"}
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
              className="bg-card rounded-2xl border border-border p-6 shadow-soft group relative"
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(deviation)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(deviation.id)}>
                  Eliminar
                </Button>
              </div>

              {/* Date */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  {format(parseISO(deviation.date), "d 'de' MMMM, yyyy", { locale: es })}
                </span>
                {deviation.reason && (
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
                  <p className="text-muted-foreground pl-6 whitespace-pre-wrap">
                    {deviation.title}
                  </p>
                </div>

                {/* Adjustment */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <ArrowRight className="w-4 h-4 text-success" />
                    Acción de ajuste
                  </div>
                  <p className="text-muted-foreground pl-6 whitespace-pre-wrap">
                    {deviation.correction}
                  </p>
                </div>
              </div>

              {/* Lesson */}
              {deviation.reason && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-start gap-2 bg-accent/10 rounded-xl p-4">
                    <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-foreground font-medium italic">
                      "{deviation.reason}"
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
