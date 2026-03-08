import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Notification } from "@/hooks/useNotifications";

const categoryStyles: Record<string, string> = {
  publishing: "bg-primary/10 text-primary",
  network: "bg-afrika-green/10 text-afrika-green",
  ai_credits: "bg-destructive/10 text-destructive",
  system: "bg-muted text-muted-foreground",
  community: "bg-accent/10 text-accent",
  advisory: "bg-afrika-blue-light/10 text-primary",
};

const categoryLabels: Record<string, string> = {
  publishing: "Publishing",
  network: "Network",
  ai_credits: "AI Credits",
  system: "System",
  community: "Community",
  advisory: "Advisory",
};

interface Props {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  actions?: React.ReactNode;
}

export function NotificationCard({ notification, onMarkRead, onDelete, actions }: Props) {
  const { id, category, title, description, link, read, created_at } = notification;
  const timeAgo = getTimeAgo(created_at);

  return (
    <div className={`relative rounded-lg border border-border p-4 transition-colors ${!read ? "bg-accent/5 border-accent/20" : "bg-card"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {!read && <div className="h-2 w-2 rounded-full bg-accent shrink-0" />}
            <Badge className={`text-[10px] font-medium ${categoryStyles[category] || categoryStyles.system}`}>
              {categoryLabels[category] || category}
            </Badge>
            <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
          </div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
          {description && <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>}
          <div className="flex items-center gap-2 mt-3">
            {actions}
            {link && !actions && (
              <Button asChild size="sm" variant="outline" className="h-7 text-xs" onClick={() => onMarkRead?.(id)}>
                <Link to={link}>View Details</Link>
              </Button>
            )}
            {!read && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => onMarkRead?.(id)}>
                Mark as read
              </Button>
            )}
          </div>
        </div>
        {onDelete && (
          <button onClick={() => onDelete(id)} className="text-muted-foreground/40 hover:text-destructive transition-colors p-1">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
