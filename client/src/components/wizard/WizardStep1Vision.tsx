/**
 * Wizard Step 1: 5-Year Vision
 * "¿Dónde quieres estar en 5 años?"
 */

import { useState } from "react";
import { Telescope, ArrowRight, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLifeOSContext } from "@/context/LifeOSContext";

interface WizardStep1VisionProps {
  onNext: () => void;
}

export function WizardStep1Vision({ onNext }: WizardStep1VisionProps) {
  const { state, updateYearSettings } = useLifeOSContext();
  const [vision, setVision] = useState(state.yearSettings?.vision5Years || "");

  const handleSubmit = () => {
    updateYearSettings({ vision5Years: vision, year: 2026 });
    onNext();
  };

  const prompts = [
    "¿Cómo es tu vida ideal profesionalmente?",
    "¿Qué relaciones significativas quieres tener?",
    "¿Cómo es tu salud y bienestar?",
    "¿Qué logros te harían sentir realizado?",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
          <Telescope className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Tu Visión a 5 Años</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Imagina tu vida en 2030. Este es el norte que guiará todas tus decisiones.
          </p>
        </div>
      </div>

      {/* Prompts */}
      <div className="bg-secondary/50 rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Lightbulb className="w-4 h-4 text-accent" />
          Preguntas guía
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {prompts.map((prompt, i) => (
            <div 
              key={i} 
              className="text-sm text-muted-foreground bg-background/50 rounded-lg px-3 py-2"
            >
              {prompt}
            </div>
          ))}
        </div>
      </div>

      {/* Vision Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Describe tu visión de vida
        </label>
        <Textarea
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          placeholder="En 2030, mi vida se ve así..."
          className="min-h-[200px] resize-none text-base leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          Sé específico y descriptivo. Esta visión será tu guía permanente.
        </p>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={vision.trim().length < 20}
          size="lg"
          className="gap-2"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
