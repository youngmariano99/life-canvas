/**
 * Wizard Step 2: Personal Mission
 * "Tu propósito central"
 */

import { useState } from "react";
import { Compass, ArrowRight, ArrowLeft, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLifeOSContext } from "@/context/LifeOSContext";

interface WizardStep2MissionProps {
  onNext: () => void;
  onBack: () => void;
}

export function WizardStep2Mission({ onNext, onBack }: WizardStep2MissionProps) {
  const { state, updateYearSettings } = useLifeOSContext();
  const [mission, setMission] = useState(state.yearSettings?.mission || "");

  const handleSubmit = () => {
    updateYearSettings({ mission });
    onNext();
  };

  const examples = [
    "Crear tecnología que empodere a las personas a tomar mejores decisiones.",
    "Ser un catalizador de cambio positivo en mi comunidad a través de la educación.",
    "Construir un legado de impacto social mientras cuido de mi familia.",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
          <Compass className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-foreground">Tu Misión Personal</h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            ¿Por qué haces lo que haces? Define el propósito que da significado a tus acciones.
          </p>
        </div>
      </div>

      {/* Examples */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Quote className="w-4 h-4 text-primary" />
          Ejemplos de misiones
        </div>
        <div className="space-y-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => setMission(example)}
              className="w-full text-left text-sm text-muted-foreground bg-secondary/50 hover:bg-secondary rounded-lg px-4 py-3 transition-colors border border-transparent hover:border-border"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>

      {/* Mission Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Escribe tu misión personal
        </label>
        <Textarea
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          placeholder="Mi misión es..."
          className="min-h-[120px] resize-none text-base leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          Una buena misión es clara, inspiradora y atemporal.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={mission.trim().length < 10}
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
