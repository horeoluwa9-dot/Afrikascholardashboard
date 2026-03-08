import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight, MessageCircle, Send, Search, User, Users,
  ExternalLink, BookOpen, Handshake, Check, CheckCheck, Globe,
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

/* ── Sample Data ── */

interface SampleConversation {
  id: string;
  name: string;
  institution: string;
  discipline: string;
  country: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: "active" | "request";
  messages: { sender: "them" | "me"; text: string; time: string }[];
}

const sampleConversations: SampleConversation[] = [
  {
    id: "c1",
    name: "Dr. Ama Mensah",
    institution: "University of Ghana",
    discipline: "Energy Policy & Sustainability",
    country: "Ghana",
    lastMessage: "Thanks for sharing the dataset. I'll review it today.",
    time: "2h ago",
    unread: 1,
    status: "active",
    messages: [
      { sender: "them", text: "Hi! I saw your research on renewable energy policy.", time: "10:15 AM" },
      { sender: "me", text: "Thank you! I'm currently expanding the dataset for Sub-Saharan Africa.", time: "10:22 AM" },
      { sender: "them", text: "Great. I'd love to collaborate on a comparative analysis.", time: "10:30 AM" },
      { sender: "me", text: "That sounds fantastic. Let me share the dataset link with you.", time: "11:05 AM" },
      { sender: "them", text: "Thanks for sharing the dataset. I'll review it today.", time: "11:42 AM" },
    ],
  },
  {
    id: "c2",
    name: "Dr. Tunde Adeyemi",
    institution: "University of Lagos",
    discipline: "Climate Policy & Environmental Science",
    country: "Nigeria",
    lastMessage: "Your paper on climate policy looks interesting.",
    time: "Yesterday",
    unread: 0,
    status: "active",
    messages: [
      { sender: "them", text: "Hello! I came across your paper on climate policy in West Africa.", time: "3:10 PM" },
      { sender: "me", text: "Thanks, Dr. Adeyemi. I appreciate the interest!", time: "3:25 PM" },
      { sender: "them", text: "Your paper on climate policy looks interesting.", time: "4:00 PM" },
    ],
  },
  {
    id: "c3",
    name: "Dr. Fatima Bello",
    institution: "Ahmadu Bello University",
    discipline: "Public Health & Epidemiology",
    country: "Nigeria",
    lastMessage: "Hello, I came across your paper and would like to connect.",
    time: "3d ago",
    unread: 0,
    status: "request",
    messages: [
      { sender: "them", text: "Hello, I came across your paper and would like to connect.", time: "9:30 AM" },
    ],
  },
];

const MessagesPage = () => {
  const [activeId, setActiveId] = useState<string>("c1");
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const isMobile = useIsMobile();
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const [conversations, setConversations] = useState(sampleConversations);

  const tabs = ["All", "Requests", "Unread"];

  const filtered = conversations.filter((c) => {
    if (tab === "Requests") return c.status === "request";
    if (tab === "Unread") return c.unread > 0;
    return true;
  }).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.institution.toLowerCase().includes(q);
  });

  const activeConvo = conversations.find((c) => c.id === activeId) || null;

  const handleSelect = (id: string) => {
    setActiveId(id);
    if (isMobile) setShowChat(true);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const requestCount = conversations.filter((c) => c.status === "request").length;
  const unreadTotal = conversations.reduce((sum, c) => sum + c.unread, 0);

  const handleAcceptRequest = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, status: "active" as const } : c));
    toast.success("Message request accepted!");
  };

  const handleIgnoreRequest = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    setActiveId(conversations.find(c => c.id !== id)?.id || "c1");
    toast.success("Message request ignored.");
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConvo) return;
    setConversations(prev => prev.map(c =>
      c.id === activeConvo.id
        ? { ...c, messages: [...c.messages, { sender: "me" as const, text: newMessage, time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) }], lastMessage: newMessage }
        : c
    ));
    setNewMessage("");
  };

  const handleConnect = () => {
    toast.success(`Connection request sent to ${activeConvo?.name}`);
  };

  const handleCollaborate = () => {
    navigate("/dashboard/network");
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Messages</span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          {unreadTotal > 0 && (
            <Badge className="bg-accent text-accent-foreground text-xs">
              {unreadTotal} unread
            </Badge>
          )}
        </div>

        {/* Three-panel layout */}
        <div className="bg-card rounded-xl border border-border overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-4 h-full">

            {/* LEFT PANEL — Conversations */}
            <div className={`border-r border-border flex flex-col lg:block ${isMobile && showChat ? "hidden" : "block"}`}>
              {/* Search */}
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations"
                    className="pl-9 h-8 text-xs"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 p-2 border-b border-border">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      tab === t ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {t}
                    {t === "Requests" && requestCount > 0 && (
                      <Badge className="ml-1 bg-destructive text-destructive-foreground text-[9px] h-4 w-4 p-0 inline-flex items-center justify-center rounded-full">
                        {requestCount}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground/30" />
                    <p className="text-xs font-medium text-foreground mt-2">No conversations found.</p>
                  </div>
                ) : (
                  filtered.map((c) => {
                    const isActive = c.id === activeId;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleSelect(c.id)}
                        className={`w-full text-left p-3 border-b border-border flex items-start gap-3 transition-colors ${
                          isActive ? "bg-secondary" : "hover:bg-secondary/50"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {getInitials(c.name)}
                          </div>
                          {c.unread > 0 && (
                            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent border-2 border-card" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate ${c.unread > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                              {c.name}
                            </p>
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                              {c.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">{c.institution}</p>
                          <p className={`text-xs truncate mt-0.5 ${c.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {c.status === "request" ? "📩 Message request" : c.lastMessage}
                          </p>
                        </div>
                        {c.unread > 0 && (
                          <Badge className="bg-accent text-accent-foreground text-[10px] h-5 w-5 flex items-center justify-center rounded-full p-0 shrink-0">
                            {c.unread}
                          </Badge>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* CENTER PANEL — Chat */}
            <div className={`lg:col-span-2 border-r border-border flex flex-col ${isMobile && !showChat ? "hidden" : "flex"}`}>
              {isMobile && showChat && (
                <button
                  onClick={() => setShowChat(false)}
                  className="p-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 border-b border-border w-full"
                >
                  <ChevronRight className="h-3 w-3 rotate-180" /> Back
                </button>
              )}

              {activeConvo ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {getInitials(activeConvo.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{activeConvo.name}</p>
                      <p className="text-[10px] text-muted-foreground">{activeConvo.institution}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {activeConvo.status === "request" && (
                      <div className="bg-secondary rounded-xl p-4 text-center space-y-3">
                        <p className="text-sm text-foreground">
                          <span className="font-semibold">{activeConvo.name}</span> wants to start a conversation with you.
                        </p>
                        <div className="flex gap-2 justify-center">
                          <Button variant="afrika" size="sm" onClick={() => handleAcceptRequest(activeConvo.id)}>Accept</Button>
                          <Button variant="outline" size="sm" onClick={() => handleIgnoreRequest(activeConvo.id)}>Ignore</Button>
                        </div>
                      </div>
                    )}
                    {activeConvo.messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] rounded-xl p-3 ${
                          msg.sender === "me"
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary text-foreground"
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "justify-end" : ""}`}>
                            <span className="text-[10px] opacity-70">{msg.time}</span>
                            {msg.sender === "me" && (
                              i < activeConvo.messages.length - 1
                                ? <CheckCheck className="h-3 w-3 opacity-60" />
                                : <Check className="h-3 w-3 opacity-50" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Composer */}
                  {activeConvo.status !== "request" && (
                    <div className="p-3 border-t border-border flex items-center gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Write a message..."
                        className="flex-1"
                      />
                      <Button variant="afrika" size="sm" disabled={!newMessage.trim()} onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground mt-2">Choose a conversation from the list to start messaging.</p>
                </div>
              )}
            </div>

            {/* RIGHT PANEL — Profile */}
            <div className="hidden lg:flex flex-col">
              {activeConvo ? (
                <div className="p-5 space-y-5">
                  {/* Avatar & Info */}
                  <div className="text-center pt-4">
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold mx-auto">
                      {getInitials(activeConvo.name)}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mt-3">{activeConvo.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{activeConvo.institution}</p>
                    <p className="text-xs text-muted-foreground">{activeConvo.discipline}</p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 bg-secondary/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-xs">
                      <BookOpen className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="text-foreground">{activeConvo.discipline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Globe className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="text-foreground">{activeConvo.country}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link to={`/dashboard/researcher?user=${encodeURIComponent(activeConvo.name)}`}>
                      <Button variant="afrika" size="sm" className="w-full gap-1.5 text-xs">
                        <User className="h-3 w-3" /> View Profile
                      </Button>
                    </Link>
                    <Link to="/dashboard/my-papers">
                      <Button variant="afrikaOutline" size="sm" className="w-full gap-1.5 text-xs">
                        <ExternalLink className="h-3 w-3" /> View Publications
                      </Button>
                    </Link>
                  </div>

                  {/* Quick Actions */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</p>
                    <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs justify-start" onClick={handleConnect}>
                      <Users className="h-3 w-3" /> Connect
                    </Button>
                    <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs justify-start" onClick={handleCollaborate}>
                      <Handshake className="h-3 w-3" /> Collaborate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-4">
                  <p className="text-xs text-muted-foreground">Select a conversation to view profile.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
