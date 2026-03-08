import { Bell } from "lucide-react";

interface Props {
  message?: string;
}

export function NotificationEmptyState({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Bell className="h-7 w-7 text-muted-foreground/50" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">You have no notifications yet.</h3>
      <p className="text-xs text-muted-foreground max-w-xs">
        {message || "When activity occurs, updates will appear here."}
      </p>
    </div>
  );
}
