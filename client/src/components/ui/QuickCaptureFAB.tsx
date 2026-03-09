import { useState, useEffect } from "react";
import { Plus, X, Inbox, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { toast } from "sonner";

export function QuickCaptureFAB() {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState("");
    const { addNote } = useLifeOSContext();

    // Floating Action Button Keyboard Shortcut (Ctrl+K or Cmd+K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const handleSave = async () => {
        if (!content.trim()) return;

        try {
            // Guardar en Bandeja de Entrada usando temporalmente la API de Notes
            // Sin Folder (root) y con un tag especial 'inbox' (o simplemente type 'note' solitaria)
            // En Sprint 7 crearemos la vista Inbox que levanta estas notas.
            const firstLine = content.split('\n')[0];
            const title = firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;

            await addNote({
                title: title,
                content: content,
                type: "note",
                folderId: "", // Backend handles empty string as null
                tags: ["custom-inbox"],
                isPinned: false
            });

            toast.success("Capturado en Bandeja de Entrada");
            setContent("");
            setIsOpen(false);
        } catch (error) {
            toast.error("Error al capturar idea");
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-6 z-50 w-14 h-14 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center group"
                aria-label="Captura Rápida (Ctrl+K)"
            >
                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </Button>

            {/* Quick Capture Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50">
                    <div className="p-4 border-b border-border/10 flex items-center justify-between bg-muted/30">
                        <div className="flex items-center gap-2 text-foreground/80">
                            <Inbox className="w-4 h-4" />
                            <span className="text-sm font-medium">Captura Rápida</span>
                            <span className="text-xs text-muted-foreground ml-2 hidden sm:inline-block border border-border/50 rounded px-1.5 py-0.5 bg-background/50">
                                Ctrl + K
                            </span>
                        </div>
                    </div>

                    <div className="p-4">
                        <Textarea
                            placeholder="¿Qué tienes en mente? (Ej. Comprar leche, Idea para video, Llamar a Juan...)"
                            className="min-h-[120px] text-lg resize-none border-none focus-visible:ring-0 p-0 bg-transparent placeholder:text-muted-foreground/50"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                    e.preventDefault();
                                    handleSave();
                                }
                            }}
                            autoFocus
                        />
                    </div>

                    <div className="p-3 border-t border-border/10 bg-muted/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
                                <Tag className="w-4 h-4 mr-1.5" />
                                <span className="text-xs">Sin clasificar</span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground hidden sm:inline-block mr-2">
                                Ctrl + Enter para guardar
                            </span>
                            <Button onClick={handleSave} size="sm" className="h-8 px-4 font-medium" disabled={!content.trim()}>
                                Capturar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
