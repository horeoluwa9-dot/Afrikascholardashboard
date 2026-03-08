import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronRight, MessageCircle, ThumbsUp, Share2, FileText,
  Copy, ExternalLink, Bookmark, BarChart3, Search, Bell,
  Library, Send, Repeat2, Users, ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: number;
  author: string;
  role: string;
  time: string;
  badge: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  reposts: number;
  words: string;
  isConnected: boolean;
}

const initialPosts: Post[] = [
  { id: 1, author: "@dimayo", role: "Research Community Member", time: "2026-03-02", badge: "EMPIRICAL RESEARCH PAPER", title: "Restaurant business in Nigeria", content: "Background | The restaurant business is a significant contributor to Nigeria's economy with a growing demand for food services...", likes: 12, comments: 3, reposts: 2, words: "~5000 words", isConnected: true },
  { id: 2, author: "@hassanb07", role: "Research Community Member", time: "2026-03-01", badge: "AGRICULTURAL RESEARCH", title: "The effect of agricultural credit on agricultural productivity in Nigeria (2000-2024)", content: "Background | Agricultural credit has been identified as a crucial factor in enhancing agricultural productivity in developing countries...", likes: 8, comments: 5, reposts: 1, words: "~5000 words", isConnected: false },
  { id: 3, author: "@hassanb17", role: "Research Community Member", time: "2026-02-28", badge: "EMPIRICAL RESEARCH PAPER", title: "The effect of agricultural credit on agricultural productivity in Nigeria (2010-2024)", content: "Background | Agricultural credit is a crucial factor in enhancing agricultural productivity, particularly in developing countries like Nigeria...", likes: 5, comments: 2, reposts: 0, words: "~8000 words", isConnected: true },
  { id: 4, author: "@fresource2021", role: "Research Community Member", time: "2026-02-27", badge: "EMPIRICAL RESEARCH PAPER", title: "Medical library Management", content: 'The Impact of Digital Resource Management on Medical Library Performance: A Mixed-Methods Study...', likes: 3, comments: 1, reposts: 0, words: "~3000 words", isConnected: false },
];

const CommunityPage = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState("All Posts");
  const tabs = ["All Posts", "Liked", "Connected"];
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [connectedAuthors, setConnectedAuthors] = useState<Set<string>>(new Set(["@dimayo", "@hassanb17"]));
  const [newPostText, setNewPostText] = useState(searchParams.get("post") || "");
  const { toast } = useToast();

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setPosts((p) => p.map((post) => post.id === id ? { ...post, likes: post.likes - 1 } : post));
      } else {
        next.add(id);
        setPosts((p) => p.map((post) => post.id === id ? { ...post, likes: post.likes + 1 } : post));
      }
      return next;
    });
  };

  const toggleConnect = (author: string) => {
    setConnectedAuthors((prev) => {
      const next = new Set(prev);
      if (next.has(author)) next.delete(author); else next.add(author);
      return next;
    });
    toast({ title: connectedAuthors.has(author) ? "Disconnected" : "Connected!", description: `You are now ${connectedAuthors.has(author) ? "no longer connected with" : "connected with"} ${author}` });
  };

  const createPost = () => {
    if (!newPostText.trim()) return;
    const newPost: Post = {
      id: Date.now(),
      author: "@defi",
      role: "Research Community Member",
      time: new Date().toISOString().split("T")[0],
      badge: "RESEARCH UPDATE",
      title: newPostText.slice(0, 60),
      content: newPostText,
      likes: 0, comments: 0, reposts: 0,
      words: "",
      isConnected: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostText("");
    toast({ title: "Post published!", description: "Your update is now visible in the community." });
  };

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (tab === "Liked") filtered = filtered.filter((p) => likedIds.has(p.id));
    if (tab === "Connected") filtered = filtered.filter((p) => connectedAuthors.has(p.author));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    }
    return filtered;
  }, [posts, tab, likedIds, connectedAuthors, searchQuery]);

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

        <div className="flex items-center gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search posts by topic or author..." className="pl-9" />
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                tab === t ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/50"
              }`}>
              {t === "Liked" ? "❤️ " + t : t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Create Post */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <Textarea placeholder="What are you working on?" className="min-h-[60px]" value={newPostText} onChange={(e) => setNewPostText(e.target.value)} />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><FileText className="h-3 w-3" /> Paper</Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><BarChart3 className="h-3 w-3" /> Dataset</Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><ExternalLink className="h-3 w-3" /> Instrument</Button>
                </div>
                <Button variant="afrika" size="sm" className="gap-1" onClick={createPost}><Send className="h-3 w-3" /> Post</Button>
              </div>
            </div>

            {/* Empty states */}
            {filteredPosts.length === 0 && tab === "Liked" && (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <ThumbsUp className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm font-semibold text-foreground mt-3">No liked posts yet</p>
                <p className="text-xs text-muted-foreground mt-1">Posts you like will appear here.</p>
                <Button variant="afrikaOutline" size="sm" className="mt-3" onClick={() => setTab("All Posts")}>Back to Community</Button>
              </div>
            )}
            {filteredPosts.length === 0 && tab === "Connected" && (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Users className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm font-semibold text-foreground mt-3">No connected researchers yet</p>
                <p className="text-xs text-muted-foreground mt-1">Connect with researchers to see their posts here.</p>
                <Link to="/dashboard/intelligence?tab=stakeholders">
                  <Button variant="afrikaOutline" size="sm" className="mt-3">Discover Researchers</Button>
                </Link>
              </div>
            )}
            {filteredPosts.length === 0 && tab === "All Posts" && (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground mt-3">No posts found.</p>
              </div>
            )}

            {/* Posts */}
            {filteredPosts.map((post) => (
              <div key={post.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link to={`/dashboard/researcher?user=${encodeURIComponent(post.author)}`} className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold hover:ring-2 hover:ring-accent/50 transition-all cursor-pointer">
                      {post.author[1].toUpperCase()}
                    </Link>
                    <div>
                      <Link to={`/dashboard/researcher?user=${encodeURIComponent(post.author)}`} className="text-sm font-medium text-foreground hover:text-accent transition-colors cursor-pointer">
                        {post.author}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">{post.role}</p>
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">{post.time}</span>
                  </div>
                  {post.author !== "@defi" && (
                    <Button variant={connectedAuthors.has(post.author) ? "secondary" : "outline"} size="sm" className="text-xs gap-1" onClick={() => toggleConnect(post.author)}>
                      <Users className="h-3 w-3" /> {connectedAuthors.has(post.author) ? "Connected" : "Connect"}
                    </Button>
                  )}
                </div>
                <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent border-accent/30">{post.badge}</Badge>
                <h3 className="text-base font-bold text-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
                {post.words && <p className="text-[10px] text-muted-foreground">{post.words}</p>}

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 text-xs transition-colors ${likedIds.has(post.id) ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}>
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
                      <DialogHeader><DialogTitle>Share this research</DialogTitle></DialogHeader>
                      <div className="space-y-3 mt-2">
                        <Textarea readOnly value={`I just published a research article on Afrika Scholar. Read here: https://afrikascholar.com/community/${post.id}`} className="text-sm" />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1 flex-1" onClick={() => { navigator.clipboard.writeText(`https://afrikascholar.com/community/${post.id}`); toast({ title: "Link copied!" }); }}><Copy className="h-3 w-3" /> Copy</Button>
                          <Button variant="afrika" size="sm" className="gap-1 flex-1" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`https://afrikascholar.com/community/${post.id}`)}`, "_blank")}><ExternalLink className="h-3 w-3" /> WhatsApp</Button>
                          <Button variant="afrikaBlue" size="sm" className="gap-1 flex-1" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://afrikascholar.com/community/${post.id}`)}`, "_blank")}><ExternalLink className="h-3 w-3" /> LinkedIn</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link to={`/dashboard/messages?user=${encodeURIComponent(post.author)}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" /> Message
                  </Link>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><FileText className="h-3 w-3" /> Request Full Paper</Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><BarChart3 className="h-3 w-3" /> Request Assessment</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground">Community Stats</h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div><p className="text-xl font-bold text-accent">{posts.length}</p><p className="text-[10px] text-muted-foreground">Posts</p></div>
                <div><p className="text-xl font-bold text-accent">453</p><p className="text-[10px] text-muted-foreground">Members</p></div>
                <div><p className="text-xl font-bold text-foreground">{likedIds.size}</p><p className="text-[10px] text-muted-foreground">Your Likes</p></div>
                <div><p className="text-xl font-bold text-foreground">{connectedAuthors.size}</p><p className="text-[10px] text-muted-foreground">Connections</p></div>
              </div>
            </div>

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
