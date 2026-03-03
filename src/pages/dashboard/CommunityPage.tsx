import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

const samplePosts = [
  {
    author: "@dimayo",
    time: "2024-09-15",
    badge: "COMPUTATIONAL RESEARCH",
    title: "Restaurant business in Nigeria",
    content: "Background | The restaurant business is a significant contributor to Nigeria's economy with a growing demand for food services. Despite its potential, the industry faces numerous challenges...",
    likes: 12,
    comments: 3,
  },
  {
    author: "@hassanb07",
    time: "2024-09-14",
    badge: "AGRICULTURAL RESEARCH",
    title: "The effect of agricultural credit on agricultural productivity in Nigeria (2000-2024)",
    content: "Background | Agricultural credit has been identified as a crucial factor in enhancing agricultural productivity in developing countries...",
    likes: 8,
    comments: 5,
  },
];

const CommunityPage = () => {
  const [tab, setTab] = useState("All Posts");
  const tabs = ["All Posts", "Feed", "Connected"];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Community</span>
        </div>

        <div className="text-center">
          <MessageCircle className="h-10 w-10 mx-auto text-accent" />
          <h1 className="text-2xl font-bold text-foreground mt-3">Research Community</h1>
          <p className="text-sm text-muted-foreground mt-1">Discover, engage, and connect over research from fellow academics.</p>
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
              {t}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {samplePosts.map((post, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold">
                    {post.author[1].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-foreground">{post.author}</span>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">{post.badge}</Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">{post.title}</h3>
              <p className="text-sm text-muted-foreground">{post.content}</p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="h-3.5 w-3.5" /> {post.likes}
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                  <MessageCircle className="h-3.5 w-3.5" /> {post.comments}
                </button>
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
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
                <Button variant="ghost" size="sm" className="text-xs gap-1 ml-auto">
                  <FileText className="h-3 w-3" /> Request Full Paper
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityPage;
