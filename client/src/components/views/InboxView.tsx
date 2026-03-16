import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Inbox, Trash2, ArrowRightCircle } from "lucide-react";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InboxView() {
    const { state, deleteNote, addProjectActivity } = useLifeOSContext();
    const [processingItem, setProcessingItem] = useState<any>(null);
    const [activityTitle, setActivityTitle] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState("");

    // Filtrar las notas cuya etiqueta es custom-inbox
    const inboxItems = useMemo(() => {
        return state.notes.filter(note => note.tags.includes("custom-inbox"));
    }, [state.notes]);

    const handleProcessItem = (item: any) => {
        setProcessingItem(item);
        setActivityTitle(item.content);
        setSelectedProjectId("");
    };

    const handleConvert = async () => {
        if (!processingItem || !selectedProjectId || !activityTitle.trim()) return;

        try {
            await addProjectActivity({
                projectId: selectedProjectId,
                title: activityTitle.trim(),
                status: "Pendiente"
            });
            await deleteNote(processingItem.id);
            toast.success("Idea convertida en actividad de proyecto");
            setProcessingItem(null);
        } catch {
            toast.error("Error al convertir idea");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteNote(id);
            toast.success("Elemento descartado");
            if (processingItem?.id === id) setProcessingItem(null);
        } catch {
            toast.error("Error al descartar elemento");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bandeja de Entrada</h2>
                    <p className="text-muted-foreground">Tu espacio de captura rápida. Clasifícalo cuando tengas tiempo libre.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline" 
                        className="hidden sm:flex gap-2"
                        disabled={inboxItems.length === 0}
                        onClick={() => handleProcessItem(inboxItems[0])}
                    >
                        Procesar Inbox
                        <ArrowRightCircle className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {inboxItems.length === 0 ? (
                <Card className="border-dashed flex items-center justify-center p-12 text-center bg-transparent">
                    <div className="max-w-md">
                        <Inbox className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-lg font-medium mb-2">Bandeja Vacía</h3>
                        <p className="text-muted-foreground text-sm">
                            Tu mente está libre. Usa <b>Ctrl + K</b> o el botón flotante para capturar ideas rápidamente y sin perder el foco de lo que estés haciendo.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {inboxItems.map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="flex flex-col h-full bg-card hover:border-primary/50 transition-colors group relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-base leading-snug break-words pr-6">
                                                {item.title}
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between">
                                        {/* Only show partial content if it's longer than the title to avoid massive cards, but Inbox items are usually short text. */}
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                                            {item.content !== item.title ? item.content : ""}
                                        </p>
                                        <div className="mt-4 pt-3 border-t border-border/10 flex items-center justify-between text-xs text-muted-foreground">
                                            <span>
                                                {format(new Date(item.createdAt), "dd MMM, HH:mm", { locale: es })}
                                            </span>
                                            <Button 
                                                variant="link" 
                                                size="sm" 
                                                className="h-auto p-0 text-primary font-semibold"
                                                onClick={() => handleProcessItem(item)}
                                            >
                                                Procesar
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Processing Dialog */}
            <Dialog open={!!processingItem} onOpenChange={(open) => !open && setProcessingItem(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Procesar Idea</DialogTitle>
                        <DialogDescription>
                            Convierte esta captura en una actividad accionable dentro de un proyecto.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-muted/50 p-4 rounded-lg italic text-sm border">
                            "{processingItem?.content}"
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="activity-title">Nombre de la Actividad</Label>
                                <Input
                                    id="activity-title"
                                    value={activityTitle}
                                    onChange={(e) => setActivityTitle(e.target.value)}
                                    placeholder="¿Qué hay que hacer?"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label>Asignar a Proyecto</Label>
                                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar un proyecto..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {state.projects.map(project => (
                                            <SelectItem key={project.id} value={project.id}>
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="destructive"
                            className="mr-auto"
                            onClick={() => handleDelete(processingItem.id)}
                        >
                            Eliminar
                        </Button>
                        <Button variant="ghost" onClick={() => setProcessingItem(null)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConvert}
                            disabled={!selectedProjectId || !activityTitle.trim()}
                        >
                            Convertir en Actividad
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
