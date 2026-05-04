import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type NotificationCategory =
  | "Publishing" | "Intelligence" | "Community" | "Credits" | "System"
  | "Invitation" | "Network" | "Engagement" | "Approval";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link: string;
  invitationKind?: "reviewer" | "editor";
  // Restrict who sees this: list of allowed accountTypes
  audience?: string[];
}

const KEY = "afrika.notifications.v1";
const EVENT = "afrika:notifications-changed";

const seed: AppNotification[] = [
  { id: "n-101", category: "Invitation", title: "Reviewer invitation", description: "African Journal of Public Health invites you to join as a peer reviewer.", time: "1 hour ago", read: false, link: "/dashboard/apply-role?role=reviewer", invitationKind: "reviewer", audience: ["researcher", "lecturer"] },
  { id: "n-102", category: "Invitation", title: "Editor invitation", description: "East African Economic Review invites you to join the editorial board.", time: "3 hours ago", read: false, link: "/dashboard/apply-role?role=editor", invitationKind: "editor", audience: ["researcher", "lecturer"] },
  { id: "n-1", category: "Publishing", title: "Submission status updated", description: "Your manuscript 'AI in African Health Systems' is now Under Review.", time: "2 hours ago", read: false, link: "/dashboard/publishing/track" },
  { id: "n-2", category: "Intelligence", title: "New journal match found", description: "African Journal of Energy Studies matches your profile with 92% score.", time: "5 hours ago", read: false, link: "/dashboard/intelligence?tab=journals" },
  { id: "n-3", category: "Community", title: "New comment on your post", description: "@hassanb07 commented on your research post.", time: "1 day ago", read: false, link: "/dashboard/community" },
  { id: "n-9", category: "System", title: "Welcome to Afrika Scholar", description: "Your Pro trial is active. Explore your dashboard.", time: "3 days ago", read: true, link: "/dashboard" },
];

function read(): AppNotification[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch { return seed; }
}
function write(list: AppNotification[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(EVENT));
}

interface Ctx {
  notifications: AppNotification[];
  unreadCount: number;
  add: (n: Omit<AppNotification, "id" | "read" | "time"> & { id?: string }) => void;
  remove: (id: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
}
const C = createContext<Ctx | null>(null);

export function AppNotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => read());

  useEffect(() => {
    const sync = () => setNotifications(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add: Ctx["add"] = useCallback((n) => {
    const next: AppNotification = {
      id: n.id || `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: "just now",
      read: false,
      ...n,
    };
    const list = [next, ...read()];
    write(list);
  }, []);

  const remove = useCallback((id: string) => write(read().filter((x) => x.id !== id)), []);
  const markRead = useCallback((id: string) => write(read().map((x) => x.id === id ? { ...x, read: true } : x)), []);
  const markAllRead = useCallback(() => write(read().map((x) => ({ ...x, read: true }))), []);
  const clear = useCallback(() => write([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  return <C.Provider value={{ notifications, unreadCount, add, remove, markRead, markAllRead, clear }}>{children}</C.Provider>;
}

export function useAppNotifications() {
  const ctx = useContext(C);
  if (!ctx) throw new Error("useAppNotifications must be used within AppNotificationsProvider");
  return ctx;
}
