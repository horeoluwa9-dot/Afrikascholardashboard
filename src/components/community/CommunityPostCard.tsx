import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageCircle, ThumbsUp, Share2, FileText, Copy,
  ExternalLink, Bookmark, BookmarkCheck, BarChart3,
  Repeat2, Users, Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Post, Comment } from "@/pages/dashboard/CommunityPage";

interface Props {
  post: Post;
  isLiked: boolean;
  isBookmarked: boolean;
  isConnected: boolean;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  onRepost: () => void;
  onToggleConnect: () => void;
  onAddComment: (content: string) => void;
}

export default function CommunityPostCard({
  post, isLiked, isBookmarked, isConnected,
  onToggleLike, onToggleBookmark, onRepost, onToggleConnect, onAddComment,
}: Props) {
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText("");
  };

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to={`/dashboard/researcher?user=${encodeURIComponent(post.author)}`}
            className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold hover:ring-2 hover:ring-accent/50 transition-all cursor-pointer"
          >
            {post.author[1].toUpperCase()}
          </Link>
          <div>
            <Link
              to={`/dashboard/researcher?user=${encodeURIComponent(post.author)}`}
              className="text-sm font-medium text-foreground hover:text-accent transition-colors cursor-pointer"
            >
              {post.author}
            </Link>
            <p className="text-[10px] text-muted-foreground">{post.role}</p>
          </div>
          <span className="text-xs text-muted-foreground ml-2">{post.time}</span>
        </div>
        {post.author !== "@defi" && (
          <Button variant={isConnected ? "secondary" : "outline"} size="sm" className="text-xs gap-1" onClick={onToggleConnect}>
            <Users className="h-3 w-3" /> {isConnected ? "Connected" : "Connect"}
          </Button>
        )}
      </div>

      <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent border-accent/30">{post.badge}</Badge>
      <h3 className="text-base font-bold text-foreground">{post.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
      {post.words && <p className="text-[10px] text-muted-foreground">{post.words}</p>}

      {/* Action Bar */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <button onClick={onToggleLike} className={`flex items-center gap-1 text-xs transition-colors ${isLiked ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}>
          <ThumbsUp className="h-3.5 w-3.5" /> {post.likes}
        </button>
        <button onClick={() => setShowComments(!showComments)} className={`flex items-center gap-1 text-xs transition-colors ${showComments ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}>
          <MessageCircle className="h-3.5 w-3.5" /> {post.comments.length}
        </button>
        <button onClick={onRepost} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
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
                <Button variant="outline" size="sm" className="gap-1 flex-1" onClick={() => { navigator.clipboard.writeText(`https://afrikascholar.com/community/${post.id}`); toast({ title: "Link copied!" }); }}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
                <Button variant="afrika" size="sm" className="gap-1 flex-1" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`https://afrikascholar.com/community/${post.id}`)}`, "_blank")}>
                  <ExternalLink className="h-3 w-3" /> WhatsApp
                </Button>
                <Button variant="afrikaBlue" size="sm" className="gap-1 flex-1" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://afrikascholar.com/community/${post.id}`)}`, "_blank")}>
                  <ExternalLink className="h-3 w-3" /> LinkedIn
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <button onClick={onToggleBookmark} className={`flex items-center gap-1 text-xs transition-colors ml-auto ${isBookmarked ? "text-accent font-medium" : "text-muted-foreground hover:text-foreground"}`}>
          {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-3 pt-2">
          {post.comments.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No comments yet. Be the first to comment.</p>
          )}
          {post.comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <Link
                to={`/dashboard/researcher?user=${encodeURIComponent(c.author)}`}
                className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-foreground text-[10px] font-bold shrink-0 hover:ring-1 hover:ring-accent/50"
              >
                {c.author[1].toUpperCase()}
              </Link>
              <div className="bg-secondary rounded-lg px-3 py-2 flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/dashboard/researcher?user=${encodeURIComponent(c.author)}`} className="text-xs font-semibold text-foreground hover:text-accent">{c.author}</Link>
                  <span className="text-[10px] text-muted-foreground">{c.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
          {/* Comment input */}
          <div className="flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="text-xs h-8"
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
            />
            <Button variant="afrika" size="sm" className="h-8 px-3" onClick={handleSubmitComment} disabled={!commentText.trim()}>
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="text-xs gap-1"><FileText className="h-3 w-3" /> Request Full Paper</Button>
        <Button variant="ghost" size="sm" className="text-xs gap-1"><BarChart3 className="h-3 w-3" /> Request Assessment</Button>
      </div>
    </div>
  );
}
