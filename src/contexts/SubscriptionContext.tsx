import { createContext, useContext, ReactNode } from "react";
import { useSubscription, Subscription } from "@/hooks/useSubscription";

interface SubscriptionContextType {
  subscription: Subscription | null;
  isActive: boolean;
  loading: boolean;
  refetch: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  isActive: false,
  loading: true,
  refetch: async () => {},
});

export const useSubscriptionContext = () => useContext(SubscriptionContext);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const sub = useSubscription();
  return (
    <SubscriptionContext.Provider value={sub}>
      {children}
    </SubscriptionContext.Provider>
  );
}
