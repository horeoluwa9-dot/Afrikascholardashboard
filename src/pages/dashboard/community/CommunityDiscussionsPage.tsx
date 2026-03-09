import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronRight, MessageCircle, Search, Send, Beaker,
  BarChart3, BookOpen, PenLine, ThumbsUp, Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Discussion {
  id: number;
  title: string;
  author: string;
  category: string;
  replies: number;
  lastActivity: string;
  preview: string;
}

const categories = ["All", "Methodology Questions", "Field Discussions", "Data Analysis", "Publishing Advice"];

const initialDiscussions: Discussion[] = [
  {
    id: 1, title: "Best econometric methods for longitudinal agricultural data?",
    author: "@hassanb07", category: "Methodology Questions", replies: 14,
    lastActivity: "2 hours ago",
    preview: "I'm working with a 24-year panel dataset on agricultural credit and productivity. What are the most robust methods?",
  },
  {
    id: 2, title: "Approaches to mixed-methods research in library science",
    author: "@fresource2021", category: "Methodology Questions", replies: 8,
    lastActivity: "5 hours ago",
    preview: "Looking for guidance on integrating qualitative interviews with quantitative survey data in information science.",
  },
  {
    id: 3, title: "Climate policy research collaboration opportunities in West Africa",
    author: "@dimayo", category: "Field Discussions", replies: 22,
    lastActivity: "1 day ago",
    preview: "Discussing ongoing and upcoming climate policy research initiatives across the ECOWAS region.",
  },
  {
    id: 4, title: "Python vs R for agricultural data analysis?",
    author: "@hassanb17", category: "Data Analysis", replies: 18,
    lastActivity: "2 days ago",
    preview: "Which tools and libraries are most effective for large-scale agricultural productivity datasets?",
  },
  {
    id: 5, title: "Tips for submitting to high-impact African journals",
    author: "@dimayo", category: "Publishing Advice", replies: 11,
    lastActivity: "3 days ago",
    preview: "Sharing experiences and tips for getting papers accepted in top-tier African academic journals.",
  },
  {
    id: 6, title: "Survey design best practices for health research",
    author: "@fresource2021", category: "Methodology Questions", replies: 6,
    lastActivity: "4 days ago",
    preview: "What are the key considerations when designing cross-sectional health surveys in Sub-Saharan Africa?",
  },
];

const categoryIcons: Record<string, any> = {
  "Methodology Questions": Beaker,
  "Field Discussions": MessageCircle,
  "Data Analysis": BarChart3,
  "Publishing Advice": BookOpen,
};

const CommunityDiscussionsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Methodology Questions");
  const { toast } = useToast();

  const filtered = discussions.filter((d) => {
    const matchesCategory = activeCategory === "All" || d.category === activeCategory;
    const matchesSearch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateDiscussion = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newDisc: Discussion = {
      id: Date.now(),
      title: newTitle,
      author: "@defi",
      category: newCategory,
      replies: 0,
      lastActivity: "Just now",
      preview: newContent.slice(0, 120),
    };
    setDiscussions((prev) => [newDisc, ...prev]);
    setNewTitle("");
    setNewContent("");
    setShowNewDiscussion(false);
    toast({ title: "Discussion started!", description: "Your topic is now open for replies." });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/community" className="hover:text-foreground">Community</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Discussions</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Discussions</h1>
            <p className="text-sm text-muted-foreground mt-1">Research conversations, methodology questions, and publishing advice.</p>
          </div>
          <Button variant="afrika" size="sm" className="gap-1.5" onClick={() => setShowNewDiscussion(!showNewDiscussion)}>
            <PenLine className="h-3.5 w-3.5" /> Start Discussion
          </Button>
        </div>

        {/* New Discussion Form */}
        {showNewDiscussion && (
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <h3 className="text-sm font-bold text-foreground">New Discussion</h3>
            <Input placeholder="Discussion title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <div className="flex gap-2 flex-wrap">
              {categories.filter((c) => c !== "All").map((cat) => (
                <button key={cat} onClick={() => setNewCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${newCategory === cat ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                  {cat}
                </button>
              ))}
            </div>
            <Textarea placeholder="Share your question or topic..." value={newContent} onChange={(e) => setNewContent(e.target.value)} className="min-h-[80px]" />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowNewDiscussion(false)}>Cancel</Button>
              <Button variant="afrika" size="sm" className="gap-1" onClick={handleCreateDiscussion} disabled={!newTitle.trim() || !newContent.trim()}>
                <Send className="h-3 w-3" /> Post Discussion
              </Button>
            </div>
          </div>
        )}

        {/* Search + Category Filters */}
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search discussions..." className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCategory === cat ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Discussions List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/30" />
              <p className="text-sm font-semibold text-foreground mt-3">No discussions found</p>
              <p className="text-xs text-muted-foreground mt-1">Start a new discussion to get the conversation going.</p>
              <Button variant="afrika" size="sm" className="mt-3 gap-1" onClick={() => setShowNewDiscussion(true)}>
                <PenLine className="h-3 w-3" /> Start Discussion
              </Button>
            </div>
          ) : (
            filtered.map((disc) => {
              const CatIcon = categoryIcons[disc.category] || MessageCircle;
              return (
                <div key={disc.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <CatIcon className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-foreground">{disc.title}</h3>
                        <Badge variant="outline" className="text-[10px]">{disc.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{disc.preview}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Link to={`/dashboard/researcher?user=${encodeURIComponent(disc.author)}`} className="text-xs text-accent hover:underline">{disc.author}</Link>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" /> {disc.replies} replies
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {disc.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityDiscussionsPage;