import { Link } from "react-router-dom";
import { FileText, Library, Bell } from "lucide-react";

interface Props {
  postCount: number;
  likeCount: number;
  connectionCount: number;
}

export default function CommunitySidebar({ postCount, likeCount, connectionCount }: Props) {
  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground">Community Stats</h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div><p className="text-xl font-bold text-accent">{postCount}</p><p className="text-[10px] text-muted-foreground">Posts</p></div>
          <div><p className="text-xl font-bold text-accent">453</p><p className="text-[10px] text-muted-foreground">Members</p></div>
          <div><p className="text-xl font-bold text-foreground">{likeCount}</p><p className="text-[10px] text-muted-foreground">Your Likes</p></div>
          <div><p className="text-xl font-bold text-foreground">{connectionCount}</p><p className="text-[10px] text-muted-foreground">Connections</p></div>
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
  );
}
