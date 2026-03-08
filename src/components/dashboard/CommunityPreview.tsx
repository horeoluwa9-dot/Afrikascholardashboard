import { Link } from "react-router-dom";
import { MessageCircle, Heart, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// TODO: Replace with real data from database
const recentPosts = [
  {
    id: 1,
    author: "Dr. Amina Osei",
    avatar: "AO",
    content: "Just submitted my paper on AI ethics in African education systems. Looking for collaborators!",
    likes: 12,
    comments: 4,
    time: "2h ago",
  },
  {
    id: 2,
    author: "Prof. Kwame Mensah",
    avatar: "KM",
    content: "New funding opportunity for climate research in West Africa. Details in thread.",
    likes: 24,
    comments: 8,
    time: "5h ago",
  },
];

export default function CommunityPreview() {
  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-bold text-foreground">Community Highlights</h3>
        </div>
        <Link to="/dashboard/community" className="text-xs text-accent hover:underline flex items-center gap-1">
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {recentPosts.map((post) => (
          <div key={post.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary text-xs font-semibold">
                  {post.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{post.author}</p>
                  <span className="text-[10px] text-muted-foreground">{post.time}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {post.likes}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> {post.comments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/dashboard/community">
        <Button variant="afrikaOutline" size="sm" className="w-full mt-4">
          Join the Conversation
        </Button>
      </Link>
    </div>
  );
}
