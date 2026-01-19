/**
 * Wizard Progress Indicator
 */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;
        
        return (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                isCompleted && "bg-primary text-primary-foreground",
                isCurrent && "bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-background",
                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                step.id
              )}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "w-8 h-0.5 mx-1 transition-colors duration-300",
                  step.id < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
