import { useState } from "react";
import { Search, MessageCircle, ArrowRight, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { ConversationWithDetails } from "@/hooks/useConversations";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
  conversations: ConversationWithDetails[];
  activeId: string | null;
  onSelect: (id: string) => void;
  tab: string;
  onTabChange: (tab: string) => void;
  loading: boolean;
}

export function ConversationList({ conversations, activeId, onSelect, tab, onTabChange, loading }: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const tabs = ["All", "Requests", "Unread"];

  const filtered = conversations.filter((c) => {
    if (tab === "Requests") return c.status === "pending";
    if (tab === "Unread") return c.unread_count > 0;
    return c.status !== "ignored";
  }).filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const other = c.participants.find((p) => p.user_id !== user?.id);
    return other?.profile?.display_name?.toLowerCase().includes(q) ||
      c.last_message?.content.toLowerCase().includes(q);
  });

  const getOtherUser = (c: ConversationWithDetails) =>
    c.participants.find((p) => p.user_id !== user?.id);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-border space-y-3">
          <div className="h-8 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search conversations" className="pl-9 h-8 text-xs" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-2 border-b border-border">
        {tabs.map((t) => (
          <button key={t} onClick={() => onTabChange(t)}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"
            }`}>
            {t}
            {t === "Requests" && conversations.filter((c) => c.status === "pending").length > 0 && (
              <Badge className="ml-1 bg-destructive text-destructive-foreground text-[9px] h-4 w-4 p-0 inline-flex items-center justify-center rounded-full">
                {conversations.filter((c) => c.status === "pending").length}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="p-6 text-center">
            {tab === "Requests" ? (
              <>
                <Users className="h-8 w-8 mx-auto text-muted-foreground/30" />
                <p className="text-xs font-medium text-foreground mt-2">No message requests.</p>
              </>
            ) : (
              <>
                <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground/30" />
                <p className="text-xs font-medium text-foreground mt-2">No conversations yet.</p>
                <p className="text-[10px] text-muted-foreground mt-1">Start a conversation by messaging a researcher from the community.</p>
                <Link to="/dashboard/community">
                  <Button variant="afrikaOutline" size="sm" className="mt-3 gap-1 text-xs">
                    Explore Community <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          filtered.map((c) => {
            const other = getOtherUser(c);
            const isActive = c.id === activeId;
            return (
              <button key={c.id} onClick={() => onSelect(c.id)}
                className={`w-full text-left p-3 border-b border-border flex items-start gap-3 transition-colors ${
                  isActive ? "bg-secondary" : "hover:bg-secondary/50"
                }`}>
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                  {getInitials(other?.profile?.display_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {other?.profile?.display_name || "Unknown User"}
                    </p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {c.last_message ? formatDistanceToNow(new Date(c.last_message.created_at), { addSuffix: true }) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.status === "pending" ? "Message request" : c.last_message?.content || "No messages yet"}
                  </p>
                </div>
                {c.unread_count > 0 && (
                  <Badge className="bg-accent text-accent-foreground text-[10px] h-5 w-5 flex items-center justify-center rounded-full p-0">
                    {c.unread_count}
                  </Badge>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
