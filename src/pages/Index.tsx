/**
 * Life-OS 2026 - Main Entry Point
 * Based on Superhábitos methodology
 */

import { LifeOSProvider, useLifeOSContext } from "@/context/LifeOSContext";
import { YearWizard } from "@/components/wizard/YearWizard";
import { Dashboard } from "@/components/layout/Dashboard";

function LifeOSApp() {
  const { state } = useLifeOSContext();

  // Show wizard if not configured
  if (!state.isConfigured) {
    return <YearWizard />;
  }

  // Show main dashboard
  return <Dashboard />;
}

const Index = () => {
  return (
    <LifeOSProvider>
      <LifeOSApp />
    </LifeOSProvider>
  );
};

export default Index;
