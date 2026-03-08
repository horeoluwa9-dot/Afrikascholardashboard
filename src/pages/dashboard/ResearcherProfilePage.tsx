import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight, User, Users, MessageCircle, ExternalLink,
  MapPin, GraduationCap, BookOpen, Send,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useConversations";
import { useToast } from "@/hooks/use-toast";

interface ResearcherProfile {
  user_id: string;
  display_name: string | null;
  institution: string | null;
  discipline: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const ResearcherProfilePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { startConversation } = useConversations();

  const username = searchParams.get("user");
  const [profile, setProfile] = useState<ResearcherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageModal, setMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) { setLoading(false); return; }
      setLoading(true);

      // Try to find by display_name matching the username pattern
      const cleanName = username.startsWith("@") ? username.slice(1) : username;
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, institution, discipline, bio, avatar_url")
        .or(`display_name.ilike.%${cleanName}%`)
        .limit(1);

      if (data && data.length > 0) {
        setProfile(data[0]);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [username]);

  const handleSendRequest = async () => {
    if (!messageText.trim() || !profile?.user_id || !user) return;
    setSending(true);
    try {
      const convId = await startConversation(profile.user_id, messageText.trim());
      setSending(false);
      setMessageModal(false);
      setMessageText("");
      if (convId) {
        toast({ title: "Message request sent!", description: `Your message has been sent to ${profile.display_name || username}.` });
        navigate(`/dashboard/messages`);
      }
    } catch {
      setSending(false);
      toast({ title: "Error", description: "Failed to send message request.", variant: "destructive" });
    }
  };

  const initials = profile?.display_name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/community" className="hover:text-foreground">Community</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Profile</span>
        </div>

        {loading ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="h-20 w-20 rounded-full bg-muted animate-pulse mx-auto" />
            <div className="h-5 w-40 bg-muted animate-pulse mx-auto mt-4 rounded" />
          </div>
        ) : !profile ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <p className="text-sm font-semibold text-foreground mt-3">Researcher not found</p>
            <p className="text-xs text-muted-foreground mt-1">This profile may not exist or is not available.</p>
            <Link to="/dashboard/community">
              <Button variant="afrikaOutline" size="sm" className="mt-4">Back to Community</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Card */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Cover */}
                <div className="h-28 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent" />
                <div className="px-6 pb-6 -mt-10">
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold border-4 border-card">
                    {initials}
                  </div>
                  <h1 className="text-xl font-bold text-foreground mt-3">
                    {profile.display_name || "Unknown Researcher"}
                  </h1>
                  {profile.institution && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <GraduationCap className="h-3.5 w-3.5" /> {profile.institution}
                    </p>
                  )}
                  {profile.discipline && (
                    <Badge variant="outline" className="mt-2 text-xs bg-accent/10 text-accent border-accent/30">
                      {profile.discipline}
                    </Badge>
                  )}
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{profile.bio}</p>
                  )}

                  {/* Action Buttons */}
                  {profile.user_id !== user?.id && (
                    <div className="flex gap-2 mt-5">
                      <Button variant="afrika" size="sm" className="gap-1.5" onClick={() => setMessageModal(true)}>
                        <MessageCircle className="h-3.5 w-3.5" /> Message
                      </Button>
                      <Button variant="afrikaOutline" size="sm" className="gap-1.5">
                        <Users className="h-3.5 w-3.5" /> Connect
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" /> View Publications
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Research Activity placeholder */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Research Activity</h3>
                <p className="text-xs text-muted-foreground">No public research activity yet.</p>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                <h3 className="text-sm font-bold text-foreground">Quick Info</h3>
                {profile.institution && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GraduationCap className="h-3.5 w-3.5 text-accent" />
                    <span>{profile.institution}</span>
                  </div>
                )}
                {profile.discipline && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5 text-accent" />
                    <span>{profile.discipline}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Request Modal */}
      <Dialog open={messageModal} onOpenChange={setMessageModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Start a Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{profile?.display_name}</p>
                {profile?.institution && (
                  <p className="text-[10px] text-muted-foreground">{profile.institution}</p>
                )}
              </div>
            </div>
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Introduce yourself and explain why you would like to connect."
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setMessageModal(false)}>Cancel</Button>
              <Button variant="afrika" size="sm" className="gap-1.5" onClick={handleSendRequest} disabled={!messageText.trim() || sending}>
                <Send className="h-3.5 w-3.5" /> {sending ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ResearcherProfilePage;
