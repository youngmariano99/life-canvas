/**
 * Life-OS Context Provider
 * Shares state across all components
 */

import React, { createContext, useContext, ReactNode } from "react";
import { useLifeOS } from "@/hooks/useLifeOS";

type LifeOSContextType = ReturnType<typeof useLifeOS>;

const LifeOSContext = createContext<LifeOSContextType | null>(null);

export function LifeOSProvider({ children }: { children: ReactNode }) {
  const lifeOS = useLifeOS();
  
  return (
    <LifeOSContext.Provider value={lifeOS}>
      {children}
    </LifeOSContext.Provider>
  );
}

export function useLifeOSContext() {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error("useLifeOSContext must be used within LifeOSProvider");
  }
  return context;
}
