import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight, MessageCircle, Users, Globe, ArrowRight,
  Send, GraduationCap, BookOpen, Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useConversations } from "@/hooks/useConversations";
import { ConversationList } from "@/components/messaging/ConversationList";
import { ChatWindow } from "@/components/messaging/ChatWindow";
import { UserProfilePanel } from "@/components/messaging/UserProfilePanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SUGGESTED_RESEARCHERS = [
  { name: "Dimayo", username: "@dimayo", institution: "University of Lagos", discipline: "Business Administration", country: "Nigeria" },
  { name: "Hassan B.", username: "@hassanb07", institution: "Ahmadu Bello University", discipline: "Agricultural Economics", country: "Nigeria" },
  { name: "Hassan B. (II)", username: "@hassanb17", institution: "University of Ibadan", discipline: "Agricultural Sciences", country: "Nigeria" },
  { name: "Fresource", username: "@fresource2021", institution: "University of Nigeria, Nsukka", discipline: "Library & Information Science", country: "Nigeria" },
];

const MessagesPage = () => {
  const {
    conversations, loading, sendMessage,
    acceptRequest, ignoreRequest, markAsRead, startConversation,
  } = useConversations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tab, setTab] = useState("All");
  const isMobile = useIsMobile();
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Message request modal state
  const [messageModal, setMessageModal] = useState(false);
  const [messageTarget, setMessageTarget] = useState<typeof SUGGESTED_RESEARCHERS[0] | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  const activeConvo = conversations.find((c) => c.id === activeId) || null;

  const handleSelect = (id: string) => {
    setActiveId(id);
    if (isMobile) setShowChat(true);
  };

  const openMessageModal = (researcher: typeof SUGGESTED_RESEARCHERS[0]) => {
    setMessageTarget(researcher);
    setMessageText("");
    setMessageModal(true);
  };

  const handleSendRequest = async () => {
    if (!messageText.trim() || !messageTarget) return;
    setSending(true);
    // For demo researchers, show a toast
    toast({ title: "Demo profile", description: "This is a demo researcher. Messaging will be available with real users." });
    setSending(false);
    setMessageModal(false);
    setMessageText("");
  };

  const hasConversations = conversations.length > 0;
  const isEmpty = !loading && !hasConversations;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Messages</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground">Messages</h1>

        {isEmpty ? (
          /* ── Rich Empty State ── */
          <div className="space-y-6">
            {/* Onboarding Card */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-accent/15 via-accent/5 to-transparent p-8 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <MessageCircle className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">No conversations yet</h2>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    Start connecting with researchers, collaborators, and academic partners across Afrika Scholar.
                  </p>
                </div>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link to="/dashboard/community">
                    <Button variant="afrika" size="sm" className="gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Explore Researchers
                    </Button>
                  </Link>
                  <Link to="/dashboard/network">
                    <Button variant="afrikaOutline" size="sm" className="gap-1.5">
                      <Globe className="h-3.5 w-3.5" /> Find Collaborators
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Suggested Researchers */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-foreground">Suggested Researchers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SUGGESTED_RESEARCHERS.map((r) => {
                  const initials = r.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                  return (
                    <div key={r.username} className="bg-card rounded-xl border border-border p-5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{r.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{r.username}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <GraduationCap className="h-3 w-3 text-accent shrink-0" />
                          <span className="truncate">{r.institution}</span>
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                          <BookOpen className="h-3 w-3 text-accent shrink-0" />
                          <span className="truncate">{r.discipline}</span>
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] bg-secondary text-foreground">{r.country}</Badge>
                      <div className="flex gap-2 pt-1">
                        <Link to={`/dashboard/researcher?user=${encodeURIComponent(r.username)}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">View Profile</Button>
                        </Link>
                        <Button variant="afrika" size="sm" className="flex-1 text-xs gap-1" onClick={() => openMessageModal(r)}>
                          <MessageCircle className="h-3 w-3" /> Message
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ── Three-panel layout ── */
          <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
              <div className={`border-r border-border lg:block ${isMobile && showChat ? "hidden" : "block"}`}>
                <ConversationList
                  conversations={conversations}
                  activeId={activeId}
                  onSelect={handleSelect}
                  tab={tab}
                  onTabChange={setTab}
                  loading={loading}
                />
              </div>
              <div className={`lg:col-span-2 border-r border-border ${isMobile && !showChat ? "hidden" : "block"}`}>
                {isMobile && showChat && (
                  <button onClick={() => setShowChat(false)} className="p-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 border-b border-border w-full">
                    <ChevronRight className="h-3 w-3 rotate-180" /> Back
                  </button>
                )}
                <ChatWindow
                  conversation={activeConvo}
                  onSend={sendMessage}
                  onAccept={acceptRequest}
                  onIgnore={ignoreRequest}
                  onMarkRead={markAsRead}
                />
              </div>
              <div className="hidden lg:block">
                <UserProfilePanel
                  participant={activeConvo?.participants.find(
                    (p) => p.user_id !== user?.id
                  )}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Request Modal */}
      <Dialog open={messageModal} onOpenChange={setMessageModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Start a Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {messageTarget && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {messageTarget.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{messageTarget.name}</p>
                  <p className="text-[10px] text-muted-foreground">{messageTarget.institution}</p>
                </div>
              </div>
            )}
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Hello, I came across your research and would like to connect."
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setMessageModal(false)}>Cancel</Button>
              <Button variant="afrika" size="sm" className="gap-1.5" onClick={handleSendRequest} disabled={!messageText.trim() || sending}>
                <Send className="h-3.5 w-3.5" /> {sending ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MessagesPage;
