/**
 * Life-OS 2026 - Main Entry Point
 * Based on Superhábitos methodology
 */

import { LifeOSProvider, useLifeOSContext } from "@/context/LifeOSContext";
import { YearWizard } from "@/components/wizard/YearWizard";
import { Dashboard } from "@/components/layout/Dashboard";
import { ServerStatusIndicator } from "@/components/ui/ServerStatusIndicator";
import { QuickCaptureFAB } from "@/components/ui/QuickCaptureFAB";

function LifeOSApp() {
  const { state } = useLifeOSContext();

  return (
    <>
      <ServerStatusIndicator />
      {/* Show Loading state or Wizard/Dashboard */}
      {state.isLoading ? (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-muted-foreground text-sm animate-pulse">Cargando Life-OS...</p>
          </div>
        </div>
      ) : (!state.isConfigured || state.isEditingWizard) ? (
        <YearWizard />
      ) : (
        <Dashboard />
      )}
      {state.isConfigured && !state.isEditingWizard && <QuickCaptureFAB />}
    </>
  );
}

const Index = () => {
  return (
    <LifeOSProvider>
      <LifeOSApp />
    </LifeOSProvider>
  );
};

export default Index;
