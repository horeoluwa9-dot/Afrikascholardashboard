import { useState, useRef, useEffect } from "react";
import { Send, Check, CheckCheck, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import type { ConversationWithDetails } from "@/hooks/useConversations";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface ChatWindowProps {
  conversation: ConversationWithDetails | null;
  onSend: (conversationId: string, content: string) => Promise<void>;
  onAccept: (conversationId: string) => Promise<void>;
  onIgnore: (conversationId: string) => Promise<void>;
  onMarkRead: (conversationId: string) => Promise<void>;
}

export function ChatWindow({ conversation, onSend, onAccept, onIgnore, onMarkRead }: ChatWindowProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading } = useMessages(conversation?.id || null);

  const otherUser = conversation?.participants.find((p) => p.user_id !== user?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    if (conversation?.id && conversation.unread_count > 0) {
      onMarkRead(conversation.id);
    }
  }, [conversation?.id]);

  const handleSend = async () => {
    if (!newMessage.trim() || !conversation) return;
    await onSend(conversation.id, newMessage);
    setNewMessage("");
  };

  // No conversation selected
  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Connect with researchers and collaborators across Afrika Scholar.</h3>
        <p className="text-sm text-muted-foreground mt-2">Select a conversation or start a new one from the community.</p>
        <Link to="/dashboard/community">
          <Button variant="afrika" size="sm" className="mt-4 gap-1">
            Explore Community <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    );
  }

  const isPending = conversation.status === "pending";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
          {otherUser?.profile?.display_name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{otherUser?.profile?.display_name || "Unknown"}</p>
          <p className="text-[10px] text-muted-foreground">{otherUser?.profile?.institution || ""}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isPending && (
          <div className="bg-secondary rounded-xl p-4 text-center space-y-3">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{otherUser?.profile?.display_name}</span> wants to start a conversation with you.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="afrika" size="sm" onClick={() => onAccept(conversation.id)}>Accept</Button>
              <Button variant="outline" size="sm" onClick={() => onIgnore(conversation.id)}>Ignore</Button>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] rounded-xl p-3 ${
              msg.sender_id === user?.id ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"
            }`}>
              <p className="text-sm">{msg.content}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.sender_id === user?.id ? "justify-end" : ""}`}>
                <span className="text-[10px] opacity-70">
                  {format(new Date(msg.created_at), "h:mm a")}
                </span>
                {msg.sender_id === user?.id && (
                  msg.read_at
                    ? <CheckCheck className="h-3 w-3 text-accent-foreground/70" />
                    : <Check className="h-3 w-3 opacity-50" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      {!isPending && (
        <div className="p-3 border-t border-border flex items-center gap-2">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Write a message…" className="flex-1" />
          <Button variant="afrika" size="sm" onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
