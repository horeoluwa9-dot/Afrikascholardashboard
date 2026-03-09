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
  Copy, ExternalLink, Bookmark, BookmarkCheck, BarChart3, Search,
  Bell, Library, Send, Repeat2, Users, ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CommunityPostCard from "@/components/community/CommunityPostCard";
import CommunitySidebar from "@/components/community/CommunitySidebar";

export interface Post {
  id: number;
  author: string;
  role: string;
  time: string;
  badge: string;
  title: string;
  content: string;
  likes: number;
  comments: Comment[];
  reposts: number;
  words: string;
  isConnected: boolean;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
}

const initialPosts: Post[] = [
  { id: 1, author: "@dimayo", role: "Research Community Member", time: "2026-03-02", badge: "EMPIRICAL RESEARCH PAPER", title: "Restaurant business in Nigeria", content: "Background | The restaurant business is a significant contributor to Nigeria's economy with a growing demand for food services...", likes: 12, comments: [{ id: 101, author: "@hassanb07", content: "Great research on the Nigerian restaurant sector. Have you considered the post-COVID impact?", time: "2026-03-03" }], reposts: 2, words: "~5000 words", isConnected: true },
  { id: 2, author: "@hassanb07", role: "Research Community Member", time: "2026-03-01", badge: "AGRICULTURAL RESEARCH", title: "The effect of agricultural credit on agricultural productivity in Nigeria (2000-2024)", content: "Background | Agricultural credit has been identified as a crucial factor in enhancing agricultural productivity in developing countries...", likes: 8, comments: [{ id: 201, author: "@dimayo", content: "Interesting methodology. Would love to see the dataset.", time: "2026-03-02" }, { id: 202, author: "@fresource2021", content: "How does this compare to West African averages?", time: "2026-03-02" }], reposts: 1, words: "~5000 words", isConnected: false },
  { id: 3, author: "@hassanb17", role: "Research Community Member", time: "2026-02-28", badge: "EMPIRICAL RESEARCH PAPER", title: "The effect of agricultural credit on agricultural productivity in Nigeria (2010-2024)", content: "Background | Agricultural credit is a crucial factor in enhancing agricultural productivity, particularly in developing countries like Nigeria...", likes: 5, comments: [], reposts: 0, words: "~8000 words", isConnected: true },
  { id: 4, author: "@fresource2021", role: "Research Community Member", time: "2026-02-27", badge: "EMPIRICAL RESEARCH PAPER", title: "Medical library Management", content: 'The Impact of Digital Resource Management on Medical Library Performance: A Mixed-Methods Study...', likes: 3, comments: [{ id: 401, author: "@hassanb17", content: "The mixed-methods approach is well suited for this topic.", time: "2026-02-28" }], reposts: 0, words: "~3000 words", isConnected: false },
];

const CommunityPage = () => {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState("All Posts");
  const tabs = ["All Posts", "Liked", "Connected"];
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
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

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: "Bookmark removed" });
      } else {
        next.add(id);
        toast({ title: "Post bookmarked!" });
      }
      return next;
    });
  };

  const handleRepost = (id: number) => {
    setPosts((p) => p.map((post) => post.id === id ? { ...post, reposts: post.reposts + 1 } : post));
    toast({ title: "Reposted!", description: "This post has been shared to your activity." });
  };

  const addComment = (postId: number, content: string) => {
    if (!content.trim()) return;
    const newComment: Comment = {
      id: Date.now(),
      author: "@defi",
      content: content.trim(),
      time: new Date().toISOString().split("T")[0],
    };
    setPosts((p) => p.map((post) =>
      post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
    ));
    toast({ title: "Comment added!" });
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
      likes: 0, comments: [], reposts: 0,
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
                  <Link to="/dashboard/my-papers"><Button variant="ghost" size="sm" className="text-xs gap-1"><FileText className="h-3 w-3" /> Paper</Button></Link>
                  <Link to="/dashboard/data/explorer"><Button variant="ghost" size="sm" className="text-xs gap-1"><BarChart3 className="h-3 w-3" /> Dataset</Button></Link>
                  <Link to="/dashboard/instrument-studio"><Button variant="ghost" size="sm" className="text-xs gap-1"><ExternalLink className="h-3 w-3" /> Instrument</Button></Link>
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
              <CommunityPostCard
                key={post.id}
                post={post}
                isLiked={likedIds.has(post.id)}
                isBookmarked={bookmarkedIds.has(post.id)}
                isConnected={connectedAuthors.has(post.author)}
                onToggleLike={() => toggleLike(post.id)}
                onToggleBookmark={() => toggleBookmark(post.id)}
                onRepost={() => handleRepost(post.id)}
                onToggleConnect={() => toggleConnect(post.author)}
                onAddComment={(content) => addComment(post.id, content)}
              />
            ))}
          </div>

          <CommunitySidebar
            postCount={posts.length}
            likeCount={likedIds.size}
            connectionCount={connectedAuthors.size}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityPage;
