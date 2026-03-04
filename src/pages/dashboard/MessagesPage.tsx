import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight, Send, Paperclip, Search, User, MoreVertical,
  FileText, BarChart3, Presentation, X, Check, CheckCheck,
  MessageCircle, ArrowRight,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  from: string;
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
  attachment?: { type: string; title: string };
}

interface Conversation {
  user: string;
  institution: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    user: "Dr. Amina Osei",
    institution: "University of Ghana",
    lastMessage: "That sounds like a great collaboration opportunity!",
    time: "2:45 PM",
    unread: 1,
    messages: [
      { id: 1, from: "Dr. Amina Osei", text: "Hi Defi, I read your paper on AI diagnostics. Very interesting work!", time: "2:30 PM", status: "read" },
      { id: 2, from: "me", text: "Thank you Dr. Osei! I've been following your work on AI Ethics as well.", time: "2:35 PM", status: "read" },
      { id: 3, from: "Dr. Amina Osei", text: "That sounds like a great collaboration opportunity!", time: "2:45 PM", status: "delivered" },
    ],
  },
  {
    user: "Prof. Kwame Mensah",
    institution: "University of Cape Town",
    lastMessage: "I'll share the dataset with you tomorrow.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, from: "Prof. Kwame Mensah", text: "Hello! I saw your research instrument on R&D capacity. Could we discuss?", time: "Yesterday", status: "read" },
      { id: 2, from: "me", text: "Of course! I'd be happy to share more details.", time: "Yesterday", status: "read" },
      { id: 3, from: "Prof. Kwame Mensah", text: "I'll share the dataset with you tomorrow.", time: "Yesterday", status: "read" },
    ],
  },
  {
    user: "Dr. Fatima Ibrahim",
    institution: "NISR Rwanda",
    lastMessage: "Looking forward to the conference!",
    time: "Mar 1",
    unread: 0,
    messages: [
      { id: 1, from: "me", text: "Hi Dr. Ibrahim, are you presenting at the Pan-African Science Conference?", time: "Mar 1", status: "read" },
      { id: 2, from: "Dr. Fatima Ibrahim", text: "Looking forward to the conference!", time: "Mar 1", status: "read" },
    ],
  },
];

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const targetUser = searchParams.get("user");
  const [conversations, setConversations] = useState(initialConversations);
  const [activeIdx, setActiveIdx] = useState(() => {
    if (targetUser) {
      const idx = initialConversations.findIndex((c) => c.user === targetUser || c.user === decodeURIComponent(targetUser));
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeConvo = conversations[activeIdx];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo?.messages.length]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      from: "me",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };
    setConversations((prev) => prev.map((c, i) => i === activeIdx ? {
      ...c, messages: [...c.messages, msg], lastMessage: newMessage, time: "Just now",
    } : c));
    setNewMessage("");
    // Simulate delivery
    setTimeout(() => {
      setConversations((prev) => prev.map((c, i) => i === activeIdx ? {
        ...c, messages: c.messages.map((m) => m.id === msg.id ? { ...m, status: "delivered" } : m),
      } : c));
    }, 1000);
  };

  const filteredConvos = useMemo(() => {
    if (!searchQuery) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((c) => c.user.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  const statusIcon = (status: string) => {
    if (status === "read") return <CheckCheck className="h-3 w-3 text-accent" />;
    if (status === "delivered") return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    return <Check className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Messages</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground">Messages</h1>

        {conversations.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-semibold text-foreground mt-3">No conversations yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Start a conversation from the Community feed.</p>
            <Link to="/dashboard/community">
              <Button variant="afrikaOutline" size="sm" className="mt-3 gap-1">Go to Community <ArrowRight className="h-3 w-3" /></Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-card rounded-xl border border-border overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
            {/* Conversations list */}
            <div className="border-r border-border flex flex-col">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search conversations" className="pl-9 h-8 text-xs" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConvos.map((c, i) => (
                  <button key={i} onClick={() => setActiveIdx(conversations.indexOf(c))}
                    className={`w-full text-left p-3 border-b border-border flex items-start gap-3 transition-colors ${conversations.indexOf(c) === activeIdx ? "bg-secondary" : "hover:bg-secondary/50"}`}>
                    <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                      {c.user.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">{c.user}</p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{c.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread > 0 && (
                      <Badge className="bg-accent text-accent-foreground text-[10px] h-5 w-5 flex items-center justify-center rounded-full p-0">{c.unread}</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Active conversation */}
            <div className="lg:col-span-2 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {activeConvo.user.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{activeConvo.user}</p>
                    <p className="text-[10px] text-muted-foreground">{activeConvo.institution}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Report User</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConvo.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-xl p-3 ${msg.from === "me" ? "bg-accent text-accent-foreground" : "bg-secondary text-foreground"}`}>
                      <p className="text-sm">{msg.text}</p>
                      {msg.attachment && (
                        <div className="mt-2 bg-background/20 rounded-lg p-2 text-xs flex items-center gap-2">
                          <FileText className="h-3 w-3" /> {msg.attachment.title}
                        </div>
                      )}
                      <div className={`flex items-center gap-1 mt-1 ${msg.from === "me" ? "justify-end" : ""}`}>
                        <span className="text-[10px] opacity-70">{msg.time}</span>
                        {msg.from === "me" && statusIcon(msg.status)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer */}
              <div className="p-3 border-t border-border flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm"><Paperclip className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem><FileText className="h-3 w-3 mr-2" /> Research Paper</DropdownMenuItem>
                    <DropdownMenuItem><BarChart3 className="h-3 w-3 mr-2" /> Dataset</DropdownMenuItem>
                    <DropdownMenuItem><Presentation className="h-3 w-3 mr-2" /> Instrument</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Write a message…" className="flex-1" />
                <Button variant="afrika" size="sm" onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
