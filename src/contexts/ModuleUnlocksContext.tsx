import { createContext, useContext, ReactNode } from "react";
import { useModuleUnlocks, ModuleType } from "@/hooks/useModuleUnlocks";

interface ModuleUnlocksContextType {
  unlockedModules: Set<ModuleType>;
  isModuleUnlocked: (module: ModuleType) => boolean;
  unlockModule: (module: ModuleType) => Promise<void>;
  loading: boolean;
}

const ModuleUnlocksContext = createContext<ModuleUnlocksContextType>({
  unlockedModules: new Set(),
  isModuleUnlocked: () => false,
  unlockModule: async () => {},
  loading: true,
});

export const useModuleUnlocksContext = () => useContext(ModuleUnlocksContext);

export function ModuleUnlocksProvider({ children }: { children: ReactNode }) {
  const unlocks = useModuleUnlocks();

  return (
    <ModuleUnlocksContext.Provider value={unlocks}>
      {children}
    </ModuleUnlocksContext.Provider>
  );
}
