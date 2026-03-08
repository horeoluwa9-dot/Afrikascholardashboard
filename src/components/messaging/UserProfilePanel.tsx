import { User, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { ConversationParticipant } from "@/hooks/useConversations";

interface UserProfilePanelProps {
  participant: ConversationParticipant | undefined;
}

export function UserProfilePanel({ participant }: UserProfilePanelProps) {
  if (!participant?.profile) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-xs text-muted-foreground">Select a conversation to view profile.</p>
      </div>
    );
  }

  const { display_name, institution, discipline, avatar_url } = participant.profile;
  const initials = display_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="p-5 space-y-5">
      <div className="text-center">
        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold mx-auto">
          {initials}
        </div>
        <h3 className="text-sm font-semibold text-foreground mt-3">{display_name || "Unknown"}</h3>
        {institution && <p className="text-xs text-muted-foreground mt-1">{institution}</p>}
        {discipline && <p className="text-xs text-muted-foreground">{discipline}</p>}
      </div>

      <div className="space-y-2">
        <Link to="/dashboard/profile">
          <Button variant="afrikaOutline" size="sm" className="w-full gap-1 text-xs">
            <User className="h-3 w-3" /> View Full Profile
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
          <Users className="h-3 w-3" /> Connect
        </Button>
        <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
          <ExternalLink className="h-3 w-3" /> View Publications
        </Button>
      </div>
    </div>
  );
}
