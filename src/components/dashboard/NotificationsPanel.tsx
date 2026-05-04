import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, Trash2, UserCheck, Shield } from "lucide-react";
import { useAppNotifications, AppNotification } from "@/hooks/useAppNotifications";
import { useAcademicEligibility } from "@/hooks/useAcademicEligibility";
import { useAuth } from "@/contexts/AuthContext";

const categoryColors: Record<string, string> = {
  Publishing: "bg-primary/10 text-primary",
  Intelligence: "bg-accent/10 text-accent",
  Community: "bg-afrika-green/10 text-afrika-green",
  Credits: "bg-destructive/10 text-destructive",
  System: "bg-muted text-muted-foreground",
  Invitation: "bg-accent/10 text-accent",
};

const filterCategories = ["All", "Invitation", "Approval", "Publishing", "Network", "Engagement", "Intelligence", "Community", "Credits", "System"];

export function NotificationsPanel() {
  const { notifications, unreadCount, markAllRead, markRead, clear, remove } = useAppNotifications();
  const { eligible } = useAcademicEligibility();
  const { accountType } = useAuth();
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const acceptInvite = (n: AppNotification) => {
    remove(n.id);
    if (n.invitationKind === "reviewer") {
      navigate("/dashboard/apply-role?role=reviewer");
    } else if (n.invitationKind === "editor") {
      navigate("/dashboard/apply-role?role=editor");
    }
  };
  const declineInvite = (n: AppNotification) => remove(n.id);

  const visible = notifications.filter((n) => {
    // Audience gating
    if (n.audience && accountType && !n.audience.includes(accountType)) return false;
    // Hide all reviewer/editor invitations from ineligible users
    if (n.category === "Invitation" && !eligible) return false;
    return true;
  });
  const filtered = filter === "All" ? visible : visible.filter((n) => n.category === filter);

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
          <Button variant="ghost" size="sm" className="text-xs gap-1 text-destructive" onClick={clear}>
                <Trash2 className="h-3 w-3" /> Clear
              </Button>
            </div>
          </div>
          <div className="flex gap-1 mt-2 flex-wrap">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-colors ${filter === cat ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/50"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </SheetHeader>

        <div className="overflow-auto max-h-[calc(100vh-140px)]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground mt-2">No notifications.</p>
            </div>
          ) : (
            filtered.map((n) => n.category === "Invitation" ? (
              <div key={n.id} className={`block px-5 py-3.5 border-b border-border ${!n.read ? "bg-accent/5" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-md bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    {n.invitationKind === "editor" ? <Shield className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge className={`text-[9px] ${categoryColors[n.category]}`}>{n.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" variant="afrika" className="h-7 text-xs" onClick={() => acceptInvite(n)}>Accept</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => declineInvite(n)}>Decline</Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={n.id}
                to={n.link}
                onClick={() => markRead(n.id)}
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
