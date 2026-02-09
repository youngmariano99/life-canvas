/**
 * Life-OS 2026 - Main Entry Point
 * Based on Superhábitos methodology
 */

import { LifeOSProvider, useLifeOSContext } from "@/context/LifeOSContext";
import { YearWizard } from "@/components/wizard/YearWizard";
import { Dashboard } from "@/components/layout/Dashboard";
import { ServerStatusIndicator } from "@/components/ui/ServerStatusIndicator";

function LifeOSApp() {
  const { state } = useLifeOSContext();

  return (
    <>
      <ServerStatusIndicator />
      {(!state.isConfigured || state.isEditingWizard) ? (
        <YearWizard />
      ) : (
        <Dashboard />
      )}
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
