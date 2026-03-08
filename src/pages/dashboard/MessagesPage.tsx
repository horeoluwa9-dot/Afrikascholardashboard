import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ChevronRight } from "lucide-react";
import { useConversations } from "@/hooks/useConversations";
import { ConversationList } from "@/components/messaging/ConversationList";
import { ChatWindow } from "@/components/messaging/ChatWindow";
import { UserProfilePanel } from "@/components/messaging/UserProfilePanel";
import { useIsMobile } from "@/hooks/use-mobile";

const MessagesPage = () => {
  const {
    conversations, loading, sendMessage,
    acceptRequest, ignoreRequest, markAsRead,
  } = useConversations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tab, setTab] = useState("All");
  const isMobile = useIsMobile();
  const [showChat, setShowChat] = useState(false);

  const activeConvo = conversations.find((c) => c.id === activeId) || null;
  const otherUser = activeConvo?.participants.find(
    (p) => p.user_id !== activeConvo?.participants[0]?.user_id // will be refined with auth
  );

  const handleSelect = (id: string) => {
    setActiveId(id);
    if (isMobile) setShowChat(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Messages</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground">Messages</h1>

        <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
            {/* Left Panel - Conversation List */}
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

            {/* Center Panel - Chat */}
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

            {/* Right Panel - Profile */}
            <div className="hidden lg:block">
              <UserProfilePanel
                participant={activeConvo?.participants.find(
                  (p) => p.user_id !== activeConvo?.participants[0]?.user_id
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
