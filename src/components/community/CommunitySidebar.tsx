import { Link } from "react-router-dom";
import { FileText, Library, Bell, TrendingUp, MessageCircle, Users, Award } from "lucide-react";

interface Props {
  postCount: number;
  likeCount: number;
  connectionCount: number;
  followCount?: number;
}

const trendingPapers = [
  { title: "Urban Food Systems in West Africa", author: "@dimayo", discussions: 32 },
  { title: "AI-Driven Health Diagnostics in Sub-Saharan Africa", author: "@hassanb07", discussions: 24 },
  { title: "Agricultural Credit and Productivity", author: "@hassanb17", discussions: 18 },
];

const activeDiscussions = [
  { title: "Best econometric methods for panel data?", comments: 14 },
  { title: "Collaboration on climate policy research", comments: 9 },
];

const topContributors = [
  { name: "@dimayo", posts: 12, collaborations: 3 },
  { name: "@hassanb07", posts: 8, collaborations: 2 },
  { name: "@fresource2021", posts: 6, collaborations: 1 },
];

export default function CommunitySidebar({ postCount, likeCount, connectionCount, followCount = 0 }: Props) {
  return (
    <div className="space-y-4">
      {/* Community Stats */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground">Community Stats</h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div><p className="text-xl font-bold text-accent">{postCount}</p><p className="text-[10px] text-muted-foreground">Posts</p></div>
          <div><p className="text-xl font-bold text-accent">453</p><p className="text-[10px] text-muted-foreground">Members</p></div>
          <div><p className="text-xl font-bold text-foreground">{likeCount}</p><p className="text-[10px] text-muted-foreground">Your Likes</p></div>
          <div><p className="text-xl font-bold text-foreground">{connectionCount}</p><p className="text-[10px] text-muted-foreground">Connections</p></div>
        </div>
        {followCount > 0 && (
          <div className="text-center pt-1 border-t border-border">
            <p className="text-lg font-bold text-foreground">{followCount}</p>
            <p className="text-[10px] text-muted-foreground">Following</p>
          </div>
        )}
      </div>

      {/* Trending Research */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-accent" />
          <h3 className="text-sm font-bold text-foreground">Trending Research</h3>
        </div>
        <div className="space-y-3">
          {trendingPapers.map((paper, i) => (
            <Link
              key={i}
              to={`/dashboard/researcher?user=${encodeURIComponent(paper.author)}`}
              className="block hover:bg-secondary/50 rounded-lg p-2 -mx-2 transition-colors"
            >
              <p className="text-xs font-medium text-foreground line-clamp-2">{paper.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground">{paper.author}</span>
                <span className="text-[10px] text-accent font-medium flex items-center gap-0.5">
                  <MessageCircle className="h-2.5 w-2.5" /> {paper.discussions} discussions
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Discussions */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="h-3.5 w-3.5 text-accent" />
          <h3 className="text-sm font-bold text-foreground">Active Discussions</h3>
        </div>
        <div className="space-y-2">
          {activeDiscussions.map((d, i) => (
            <div key={i} className="flex items-start gap-2 py-1">
              <div className="flex-1">
                <p className="text-xs text-foreground font-medium line-clamp-2">{d.title}</p>
                <p className="text-[10px] text-muted-foreground">{d.comments} comments</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <div className="flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-accent" />
          <h3 className="text-sm font-bold text-foreground">Top Contributors</h3>
        </div>
        <div className="space-y-2">
          {topContributors.map((c, i) => (
            <Link
              key={i}
              to={`/dashboard/researcher?user=${encodeURIComponent(c.name)}`}
              className="flex items-center gap-2 py-1.5 hover:bg-secondary/50 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-[10px] font-bold">
                {c.name[1].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.posts} posts · {c.collaborations} collabs</p>
              </div>
              {i === 0 && <span className="text-[10px] text-accent font-semibold">🏆</span>}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-2">
        <h3 className="text-sm font-bold text-foreground">Quick Links</h3>
        <Link to="/dashboard/generate-paper" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors">
          <FileText className="h-3.5 w-3.5 text-accent" /> Generate Paper
        </Link>
        <Link to="/dashboard/library" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors">
          <Library className="h-3.5 w-3.5 text-accent" /> My Library
        </Link>
        <Link to="/dashboard/notifications" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors">
          <Bell className="h-3.5 w-3.5 text-accent" /> Notifications
        </Link>
      </div>
    </div>
  );
}