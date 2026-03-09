import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Inbox, Trash2, ArrowRightCircle } from "lucide-react";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function InboxView() {
    const { state, deleteNote } = useLifeOSContext();

    // Filtrar las notas cuya etiqueta es custom-inbox y no tienen carpeta (raíz puramente para inbox temporal)
    const inboxItems = useMemo(() => {
        return state.notes.filter(note => note.tags.includes("custom-inbox"));
    }, [state.notes]);

    const handleDelete = async (id: string) => {
        try {
            await deleteNote(id);
            toast.success("Elemento descartado");
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
                    <Button variant="outline" className="hidden sm:flex">
                        Procesar Inbox
                        <ArrowRightCircle className="ml-2 w-4 h-4" />
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
                                            <Button variant="link" size="sm" className="h-auto p-0 text-primary">
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
        </div>
    );
}
