import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type ModuleType = "publishing" | "research_intelligence" | "publeesh_ai" | "instrument_studio" | "my_research" | "institutional";

interface UseModuleUnlocksReturn {
  unlockedModules: Set<ModuleType>;
  isModuleUnlocked: (module: ModuleType) => boolean;
  unlockModule: (module: ModuleType) => Promise<void>;
  loading: boolean;
}

export function useModuleUnlocks(): UseModuleUnlocksReturn {
  const { user } = useAuth();
  const [unlockedModules, setUnlockedModules] = useState<Set<ModuleType>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUnlockedModules(new Set());
      setLoading(false);
      return;
    }

    const fetchUnlocks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_module_unlocks")
        .select("module")
        .eq("user_id", user.id);

      if (!error && data) {
        setUnlockedModules(new Set(data.map((row) => row.module as ModuleType)));
      }
      setLoading(false);
    };

    fetchUnlocks();
  }, [user]);

  const isModuleUnlocked = useCallback(
    (module: ModuleType) => unlockedModules.has(module),
    [unlockedModules]
  );

  const unlockModule = useCallback(
    async (module: ModuleType) => {
      if (!user || unlockedModules.has(module)) return;

      const { error } = await supabase
        .from("user_module_unlocks")
        .insert({ user_id: user.id, module });

      if (!error) {
        setUnlockedModules((prev) => new Set([...prev, module]));
      }
    },
    [user, unlockedModules]
  );

  return { unlockedModules, isModuleUnlocked, unlockModule, loading };
}
