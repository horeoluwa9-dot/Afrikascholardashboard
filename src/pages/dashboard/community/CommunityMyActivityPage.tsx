import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight, FileText, MessageCircle, Bookmark, UserCheck,
  Trash2, Edit, ThumbsUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tabs = ["My Posts", "Saved Posts", "My Discussions", "Following"];

interface ActivityPost {
  id: number;
  title: string;
  type: string;
  time: string;
  likes: number;
  comments: number;
}

interface SavedPost {
  id: number;
  title: string;
  author: string;
  time: string;
}

interface FollowedResearcher {
  name: string;
  username: string;
  institution: string;
}

const myPosts: ActivityPost[] = [
  { id: 1, title: "Restaurant business in Nigeria", type: "Research Paper", time: "2026-03-02", likes: 12, comments: 1 },
  { id: 2, title: "Looking for co-researchers on urban food systems", type: "Collaboration Request", time: "2026-02-25", likes: 18, comments: 0 },
];

const savedPosts: SavedPost[] = [
  { id: 101, title: "Agricultural credit on productivity (2000-2024)", author: "@hassanb07", time: "2026-03-01" },
  { id: 102, title: "Library Performance Evaluation Survey Template", author: "@fresource2021", time: "2026-02-20" },
];

const myDiscussions: ActivityPost[] = [
  { id: 201, title: "Best approaches for longitudinal data analysis?", type: "Methodology Questions", time: "2026-02-22", likes: 14, comments: 6 },
];

const followingResearchers: FollowedResearcher[] = [
  { name: "Hassan B.", username: "@hassanb07", institution: "Ahmadu Bello University" },
  { name: "Fresource", username: "@fresource2021", institution: "University of Nigeria, Nsukka" },
];

const CommunityMyActivityPage = () => {
  const [activeTab, setActiveTab] = useState("My Posts");
  const { toast } = useToast();

  const handleDelete = (title: string) => {
    toast({ title: "Post deleted", description: `"${title}" has been removed.` });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/community" className="hover:text-foreground">Community</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">My Activity</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">My Activity</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your posts, saved content, and followed researchers.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeTab === t ? "bg-accent text-accent-foreground border-accent" : "border-border text-muted-foreground hover:border-accent/50"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* My Posts */}
        {activeTab === "My Posts" && (
          <div className="space-y-3">
            {myPosts.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm font-semibold text-foreground mt-3">No posts yet</p>
                <p className="text-xs text-muted-foreground mt-1">Share your research with the community.</p>
                <Link to="/dashboard/community">
                  <Button variant="afrika" size="sm" className="mt-3">Create Post</Button>
                </Link>
              </div>
            ) : (
              myPosts.map((post) => (
                <div key={post.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-[10px]">{post.type}</Badge>
                      <span className="text-[10px] text-muted-foreground">{post.time}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><ThumbsUp className="h-2.5 w-2.5" /> {post.likes}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><MessageCircle className="h-2.5 w-2.5" /> {post.comments}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-3">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete(post.title)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Posts */}
        {activeTab === "Saved Posts" && (
          <div className="space-y-3">
            {savedPosts.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <Bookmark className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm font-semibold text-foreground mt-3">No saved posts</p>
                <p className="text-xs text-muted-foreground mt-1">Save posts from the feed to access them here.</p>
              </div>
            ) : (
              savedPosts.map((post) => (
                <div key={post.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{post.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Link to={`/dashboard/researcher?user=${encodeURIComponent(post.author)}`} className="text-[10px] text-accent hover:underline">{post.author}</Link>
                      <span className="text-[10px] text-muted-foreground">{post.time}</span>
                    </div>
                  </div>
                  <Bookmark className="h-4 w-4 text-accent shrink-0 ml-3" />
                </div>
              ))
            )}
          </div>
        )}

        {/* My Discussions */}
        {activeTab === "My Discussions" && (
          <div className="space-y-3">
            {myDiscussions.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm font-semibold text-foreground mt-3">No discussions yet</p>
                <Link to="/dashboard/community/discussions">
                  <Button variant="afrika" size="sm" className="mt-3">Start Discussion</Button>
                </Link>
              </div>
            ) : (
              myDiscussions.map((disc) => (
                <div key={disc.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{disc.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-[10px]">{disc.type}</Badge>
                      <span className="text-[10px] text-muted-foreground">{disc.time}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><MessageCircle className="h-2.5 w-2.5" /> {disc.comments}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Following */}
        {activeTab === "Following" && (
          <div className="space-y-3">
            {followingResearchers.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <UserCheck className="h-10 w-10 mx-auto text-muted-foreground/30" />
                <p className="text-sm font-semibold text-foreground mt-3">Not following anyone yet</p>
                <Link to="/dashboard/community/researchers">
                  <Button variant="afrikaOutline" size="sm" className="mt-3">Discover Researchers</Button>
                </Link>
              </div>
            ) : (
              followingResearchers.map((r) => (
                <Link key={r.username} to={`/dashboard/researcher?user=${encodeURIComponent(r.username)}`}
                  className="bg-card rounded-xl border border-border p-5 flex items-center gap-3 hover:shadow-sm transition-shadow block">
                  <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold shrink-0">
                    {r.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.institution}</p>
                  </div>
                  <UserCheck className="h-4 w-4 text-accent shrink-0" />
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CommunityMyActivityPage;