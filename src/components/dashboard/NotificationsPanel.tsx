import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2 } from "lucide-react";

interface Notification {
  id: number;
  category: "Publishing" | "Intelligence" | "Community" | "Credits" | "System";
  title: string;
  description: string;
  time: string;
  read: boolean;
  link: string;
}

const initialNotifications: Notification[] = [
  { id: 1, category: "Publishing", title: "Submission status updated", description: "Your manuscript 'AI in African Health Systems' is now Under Review.", time: "2 hours ago", read: false, link: "/dashboard/publishing/track" },
  { id: 2, category: "Intelligence", title: "New journal match found", description: "Journal of the ACM matches your research profile with 92% score.", time: "5 hours ago", read: false, link: "/dashboard/intelligence" },
  { id: 3, category: "Community", title: "New comment on your post", description: "@hassanb07 commented on your research post.", time: "1 day ago", read: false, link: "/dashboard/community" },
  { id: 4, category: "Intelligence", title: "Conference deadline approaching", description: "ICML 2026 submission deadline is in 5 days.", time: "1 day ago", read: true, link: "/dashboard/intelligence" },
  { id: 5, category: "Credits", title: "Credits running low", description: "You have 5 Paper Credits remaining this month.", time: "2 days ago", read: true, link: "/dashboard/billing" },
  { id: 6, category: "System", title: "Welcome to Afrika Scholar", description: "Your Pro trial is active. Explore your dashboard.", time: "3 days ago", read: true, link: "/dashboard" },
];

const categoryColors: Record<string, string> = {
  Publishing: "bg-primary/10 text-primary",
  Intelligence: "bg-accent/10 text-accent",
  Community: "bg-afrika-green/10 text-afrika-green",
  Credits: "bg-destructive/10 text-destructive",
  System: "bg-muted text-muted-foreground",
};

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));
  const clearAll = () => setNotifications([]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-md hover:bg-secondary transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-accent" />
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-96 p-0">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">Notifications</SheetTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={markAllRead}>
                <Check className="h-3 w-3" /> Mark all read
              </Button>
              <Button variant="ghost" size="sm" className="text-xs gap-1 text-destructive" onClick={clearAll}>
                <Trash2 className="h-3 w-3" /> Clear
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="overflow-auto max-h-[calc(100vh-80px)]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground mt-2">No notifications.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                to={n.link}
                className={`block px-5 py-3.5 border-b border-border hover:bg-secondary/50 transition-colors ${!n.read ? "bg-accent/5" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {!n.read && <div className="h-2 w-2 rounded-full bg-accent mt-1.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge className={`text-[9px] ${categoryColors[n.category]}`}>{n.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
