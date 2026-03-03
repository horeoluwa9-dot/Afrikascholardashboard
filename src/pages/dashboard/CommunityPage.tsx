import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronRight,
  MessageCircle,
  ThumbsUp,
  Share2,
  FileText,
  Copy,
  ExternalLink,
  Bookmark,
  BarChart3,
  Search,
  Bell,
  Library,
  Send,
  Repeat2,
} from "lucide-react";

const samplePosts = [
  {
    author: "@dimayo",
    role: "Research Community Member",
    time: "2026-03-02",
    badge: "EMPIRICAL RESEARCH PAPER",
    title: "Restaurant business in Nigeria",
    content: "Background | The restaurant business is a significant contributor to Nigeria's economy with a growing demand for food services. Despite its potential, the industry faces numerous challenges, including intense competition, high operational costs, and changing consumer preferences. Objectives | This study aims to identify...",
    likes: 12,
    comments: 3,
    reposts: 2,
    words: "~5000 words",
  },
  {
    author: "@hassanb07",
    role: "Research Community Member",
    time: "2026-03-01",
    badge: "AGRICULTURAL RESEARCH",
    title: "The effect of agricultural credit on agricultural productivity in Nigeria (2000-2024)",
    content: "Background | Agricultural credit has been identified as a crucial factor in enhancing agricultural productivity in developing countries. In Nigeria, the agricultural sector is a significant contributor to the nation's GDP, yet it faces numerous challenges, including limited access to credit. Objectives | This study...",
    likes: 8,
    comments: 5,
    reposts: 1,
    words: "~5000 words",
  },
  {
    author: "@hassanb17",
    role: "Research Community Member",
    time: "2026-02-28",
    badge: "EMPIRICAL RESEARCH PAPER",
    title: "The effect of agricultural credit on agricultural productivity in Nigeria (2010-2024)",
    content: "Background | Agricultural credit is a crucial factor in enhancing agricultural productivity, particularly in developing countries like Nigeria. Despite its importance, the impact of agricultural credit on agricultural productivity in Nigeria remains understudied. Objectives | This study aims to investigate the effect of...",
    likes: 5,
    comments: 2,
    reposts: 0,
    words: "~8000 words",
  },
  {
    author: "@fresource2021",
    role: "Research Community Member",
    time: "2026-02-27",
    badge: "EMPIRICAL RESEARCH PAPER",
    title: "Medical library Management",
    content: '""TITLE"" The Impact of Digital Resource Management on Medical Library Performance: A Mixed-Methods Study ""RUNNING HEAD"" Digital Resource Management on Medical Libraries ""ABSTRACT"" ""Background"" Medical libraries play a critical role in supporting healthcare professionals\' information needs. However...',
    likes: 3,
    comments: 1,
    reposts: 0,
    words: "~3000 words",
  },
];

const CommunityPage = () => {
  const [tab, setTab] = useState("All Posts");
  const tabs = ["All Posts", "Liked", "Connected"];
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Community</span>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            <span className="heading-serif text-accent italic">Research</span> Community
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Discover, engage with, and connect over research from fellow academics.</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by topic or author..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                tab === t ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/50"
              }`}
            >
              {t === "Liked" ? "❤️ " + t : t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <Textarea placeholder="What are you working on?" className="min-h-[60px]" />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><FileText className="h-3 w-3" /> Paper</Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><BarChart3 className="h-3 w-3" /> Dataset</Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><ExternalLink className="h-3 w-3" /> Instrument</Button>
                </div>
                <Button variant="afrika" size="sm" className="gap-1"><Send className="h-3 w-3" /> Post</Button>
              </div>
            </div>

            {/* Posts */}
            {samplePosts.map((post, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">
                      {post.author[1].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{post.author}</span>
                      <p className="text-[10px] text-muted-foreground">{post.role}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{post.time}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent border-accent/30">{post.badge}</Badge>
                <h3 className="text-base font-bold text-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
                {post.words && <p className="text-[10px] text-muted-foreground">{post.words}</p>}

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ThumbsUp className="h-3.5 w-3.5" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Repeat2 className="h-3.5 w-3.5" /> {post.reposts}
                  </button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        <Share2 className="h-3.5 w-3.5" /> Share
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Share this research</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 mt-2">
                        <Textarea
                          readOnly
                          value={`I just published a research article on Afrika Scholar. Read here: https://afrikascholar.com/community/${i}`}
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1 flex-1"><Copy className="h-3 w-3" /> Copy Link</Button>
                          <Button variant="afrika" size="sm" className="gap-1 flex-1"><ExternalLink className="h-3 w-3" /> WhatsApp</Button>
                          <Button variant="afrikaBlue" size="sm" className="gap-1 flex-1"><ExternalLink className="h-3 w-3" /> LinkedIn</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    <FileText className="h-3 w-3" /> Request Full Paper
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    <BarChart3 className="h-3 w-3" /> Request Assessment
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Community Stats */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground">Community Stats</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold text-accent">538</p>
                  <p className="text-[10px] text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-accent">453</p>
                  <p className="text-[10px] text-muted-foreground">Members</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">4</p>
                  <p className="text-[10px] text-muted-foreground">Likes</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">5</p>
                  <p className="text-[10px] text-muted-foreground">Comments</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-2">
              <h3 className="text-sm font-bold text-foreground">Quick Links</h3>
              <Link to="/dashboard/generate-paper" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors">
                <FileText className="h-3.5 w-3.5 text-accent" /> Generate Paper
              </Link>
              <Link to="/dashboard/my-papers" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors">
                <Library className="h-3.5 w-3.5 text-accent" /> My Library
              </Link>
              <Link to="/dashboard/settings" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors">
                <Bell className="h-3.5 w-3.5 text-accent" /> Notifications
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityPage;
