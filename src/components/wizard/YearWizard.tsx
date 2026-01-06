/**
 * Year Wizard - Step-by-step annual planning setup
 * Based on Superhábitos methodology
 */

import { motion, AnimatePresence } from "framer-motion";
import { useLifeOSContext } from "@/context/LifeOSContext";
import { WizardStep1Vision } from "./WizardStep1Vision";
import { WizardStep2Mission } from "./WizardStep2Mission";
import { WizardStep3Roles } from "./WizardStep3Roles";
import { WizardStep4Goals } from "./WizardStep4Goals";
import { WizardProgress } from "./WizardProgress";

const STEPS = [
  { id: 1, title: "Visión 5 Años", description: "¿Dónde quieres estar?" },
  { id: 2, title: "Misión Personal", description: "Tu propósito central" },
  { id: 3, title: "Roles de Vida", description: "Máximo 7 áreas clave" },
  { id: 4, title: "Objetivos 2026", description: "Metas por rol" },
];

export function YearWizard() {
  const { state, setWizardStep, completeWizard } = useLifeOSContext();
  const currentStep = state.wizardStep;

  const handleNext = () => {
    if (currentStep < 4) {
      setWizardStep(currentStep + 1);
    } else {
      completeWizard();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setWizardStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">Life-OS 2026</h1>
              <p className="text-sm text-muted-foreground">Planificación Anual</p>
            </div>
            <WizardProgress steps={STEPS} currentStep={currentStep} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {currentStep === 1 && (
              <WizardStep1Vision onNext={handleNext} />
            )}
            {currentStep === 2 && (
              <WizardStep2Mission onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 3 && (
              <WizardStep3Roles onNext={handleNext} onBack={handleBack} />
            )}
            {currentStep === 4 && (
              <WizardStep4Goals onNext={handleNext} onBack={handleBack} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
