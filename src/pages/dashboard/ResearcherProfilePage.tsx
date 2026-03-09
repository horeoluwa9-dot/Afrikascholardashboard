import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight, User, Users, MessageCircle, BookOpen, Send,
  GraduationCap, MapPin, Globe, FileText, ArrowLeft,
  UserPlus, UserCheck, Database, Handshake, BarChart3,
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
  isMock?: boolean;
}

// Fallback mock profiles for community demo users not in the database
const MOCK_PROFILES: Record<string, ResearcherProfile> = {
  "@dimayo": {
    user_id: "mock-dimayo",
    display_name: "Dimayo",
    institution: "University of Lagos",
    discipline: "Business Administration",
    bio: "Researching restaurant business dynamics and economic growth patterns in Nigeria.",
    avatar_url: null,
    isMock: true,
  },
  "@hassanb07": {
    user_id: "mock-hassanb07",
    display_name: "Hassan B.",
    institution: "Ahmadu Bello University",
    discipline: "Agricultural Economics",
    bio: "Focused on agricultural credit systems and their impact on productivity in developing nations.",
    avatar_url: null,
    isMock: true,
  },
  "@hassanb17": {
    user_id: "mock-hassanb17",
    display_name: "Hassan B. (II)",
    institution: "University of Ibadan",
    discipline: "Agricultural Sciences",
    bio: "Agricultural productivity researcher with focus on credit mechanisms in sub-Saharan Africa.",
    avatar_url: null,
    isMock: true,
  },
  "@fresource2021": {
    user_id: "mock-fresource2021",
    display_name: "Fresource",
    institution: "University of Nigeria, Nsukka",
    discipline: "Library & Information Science",
    bio: "Digital resource management researcher specializing in medical library performance evaluation.",
    avatar_url: null,
    isMock: true,
  },
  "Dr. Ama Mensah": {
    user_id: "mock-ama-mensah",
    display_name: "Dr. Ama Mensah",
    institution: "University of Ghana",
    discipline: "Energy Policy & Sustainability",
    bio: "Researching renewable energy transitions, climate policy, and sustainable development across West Africa.",
    avatar_url: null,
    isMock: true,
  },
  "Dr. Tunde Adeyemi": {
    user_id: "mock-tunde-adeyemi",
    display_name: "Dr. Tunde Adeyemi",
    institution: "University of Lagos",
    discipline: "Climate Policy & Environmental Science",
    bio: "Environmental scientist specializing in climate adaptation strategies and policy analysis for West African nations.",
    avatar_url: null,
    isMock: true,
  },
  "Dr. Fatima Bello": {
    user_id: "mock-fatima-bello",
    display_name: "Dr. Fatima Bello",
    institution: "Ahmadu Bello University",
    discipline: "Public Health & Epidemiology",
    bio: "Public health researcher focused on disease surveillance, epidemiological modeling, and health systems strengthening.",
    avatar_url: null,
    isMock: true,
  },
};

// Mock community activity per researcher
const MOCK_ACTIVITY: Record<string, { posts: number; collaborations: number; datasets: number; recentPosts: { title: string; type: string; time: string }[] }> = {
  "@dimayo": {
    posts: 12, collaborations: 3, datasets: 1,
    recentPosts: [
      { title: "Restaurant business in Nigeria", type: "Research Paper", time: "2026-03-02" },
      { title: "Looking for co-researchers on urban food systems", type: "Collaboration Request", time: "2026-02-25" },
    ],
  },
  "@hassanb07": {
    posts: 8, collaborations: 2, datasets: 2,
    recentPosts: [
      { title: "Agricultural credit on productivity (2000-2024)", type: "Dataset", time: "2026-03-01" },
      { title: "Best approaches for longitudinal data analysis?", type: "Research Question", time: "2026-02-22" },
    ],
  },
  "@hassanb17": {
    posts: 5, collaborations: 1, datasets: 0,
    recentPosts: [
      { title: "Agricultural credit on productivity (2010-2024)", type: "Research Paper", time: "2026-02-28" },
    ],
  },
  "@fresource2021": {
    posts: 6, collaborations: 1, datasets: 1,
    recentPosts: [
      { title: "Medical library Management", type: "Research Paper", time: "2026-02-27" },
      { title: "Library Performance Evaluation Survey Template", type: "Research Instrument", time: "2026-02-20" },
    ],
  },
};

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
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) { setLoading(false); return; }
      setLoading(true);

      const cleanName = username.startsWith("@") ? username.slice(1) : username;
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, institution, discipline, bio, avatar_url")
        .or(`display_name.ilike.%${cleanName}%`)
        .limit(1);

      if (data && data.length > 0) {
        setProfile(data[0]);
      } else {
        const mockKey = username.startsWith("@") ? username : `@${username}`;
        const mock = MOCK_PROFILES[mockKey] || MOCK_PROFILES[username] || null;
        setProfile(mock);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [username]);

  const handleSendRequest = async () => {
    if (!messageText.trim() || !profile || !user) return;
    if (profile.isMock) {
      toast({ title: "Demo profile", description: "This is a demo researcher. Messaging will be available with real users." });
      setMessageModal(false);
      setMessageText("");
      return;
    }
    setSending(true);
    try {
      const convId = await startConversation(profile.user_id, messageText.trim());
      setSending(false);
      setMessageModal(false);
      setMessageText("");
      if (convId) {
        toast({ title: "Message request sent!", description: `Your message has been sent to ${profile.display_name || username}.` });
        navigate("/dashboard/messages");
      }
    } catch {
      setSending(false);
      toast({ title: "Error", description: "Failed to send message request.", variant: "destructive" });
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({ title: isFollowing ? `Unfollowed ${username}` : `Following ${username}`, description: isFollowing ? undefined : "Their posts will appear higher in your feed." });
  };

  const initials = profile?.display_name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  const researchTags = profile?.discipline?.split(",").map((t) => t.trim()).filter(Boolean) || [];

  const activity = username ? MOCK_ACTIVITY[username] || { posts: 0, collaborations: 0, datasets: 0, recentPosts: [] } : { posts: 0, collaborations: 0, datasets: 0, recentPosts: [] };

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
          <div className="bg-card rounded-xl border border-border p-12 text-center space-y-3">
            <User className="h-12 w-12 mx-auto text-muted-foreground/30" />
            <p className="text-base font-semibold text-foreground">Profile not available</p>
            <p className="text-sm text-muted-foreground">This researcher profile is currently unavailable.</p>
            <div className="flex gap-2 justify-center mt-4">
              <Link to="/dashboard/community">
                <Button variant="afrikaOutline" size="sm">Back to Community</Button>
              </Link>
              <Link to="/dashboard/network">
                <Button variant="outline" size="sm">Explore Researchers</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Profile Card */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent" />
                <div className="px-6 pb-6 -mt-10">
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold border-4 border-card">
                    {initials}
                  </div>
                  <h1 className="text-xl font-bold text-foreground mt-3">
                    {profile.display_name || "Unknown Researcher"}
                  </h1>
                  {profile.institution && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                      <GraduationCap className="h-3.5 w-3.5" /> {profile.institution}
                    </p>
                  )}
                  {profile.discipline && (
                    <Badge variant="outline" className="mt-2 text-xs bg-accent/10 text-accent border-accent/30">
                      {profile.discipline}
                    </Badge>
                  )}

                  {profile.bio ? (
                    <div className="mt-4">
                      <h3 className="text-xs font-semibold text-foreground mb-1">About</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-4 italic">No bio added yet.</p>
                  )}

                  {/* Action Buttons */}
                  {profile.user_id !== user?.id && (
                    <div className="flex gap-2 mt-5 flex-wrap">
                      <Button variant="afrika" size="sm" className="gap-1.5" onClick={() => setMessageModal(true)}>
                        <MessageCircle className="h-3.5 w-3.5" /> Message
                      </Button>
                      <Button variant="afrikaOutline" size="sm" className="gap-1.5">
                        <Users className="h-3.5 w-3.5" /> Connect
                      </Button>
                      <Button
                        variant={isFollowing ? "secondary" : "outline"}
                        size="sm"
                        className="gap-1.5"
                        onClick={handleFollow}
                      >
                        {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                        {isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" /> View Publications
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Research Interests */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Research Interests</h3>
                {researchTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {researchTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-secondary text-foreground">{tag}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Research interests not added.</p>
                )}
              </div>

              {/* Publications */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Publications</h3>
                <p className="text-xs text-muted-foreground italic">No publications yet.</p>
              </div>

              {/* Recent Community Posts */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Recent Community Posts</h3>
                {activity.recentPosts.length > 0 ? (
                  <div className="space-y-3">
                    {activity.recentPosts.map((p, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                        <FileText className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className="text-[10px]">{p.type}</Badge>
                            <span className="text-[10px] text-muted-foreground">{p.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No community posts yet.</p>
                )}
              </div>

              {/* Collaborations */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Collaborations</h3>
                {activity.collaborations > 0 ? (
                  <p className="text-sm text-muted-foreground">{activity.collaborations} active collaboration{activity.collaborations !== 1 ? "s" : ""}</p>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No collaborations yet.</p>
                )}
              </div>

              {/* Datasets Shared */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Datasets Shared</h3>
                {activity.datasets > 0 ? (
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-accent" />
                    <p className="text-sm text-muted-foreground">{activity.datasets} dataset{activity.datasets !== 1 ? "s" : ""} shared with the community</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No datasets shared yet.</p>
                )}
              </div>

              {/* Network / Connections */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-sm font-bold text-foreground mb-3">Network</h3>
                <p className="text-xs text-muted-foreground italic">No network connections yet.</p>
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
                {!profile.institution && !profile.discipline && (
                  <p className="text-xs text-muted-foreground italic">No details available.</p>
                )}
              </div>

              {/* Community Activity Metrics */}
              <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                <h3 className="text-sm font-bold text-foreground">Community Activity</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold text-accent">{activity.posts}</p>
                    <p className="text-[10px] text-muted-foreground">Posts</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{activity.collaborations}</p>
                    <p className="text-[10px] text-muted-foreground">Collabs</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{activity.datasets}</p>
                    <p className="text-[10px] text-muted-foreground">Datasets</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-5 space-y-2">
                <h3 className="text-sm font-bold text-foreground">Quick Actions</h3>
                <Link to="/dashboard/community">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs gap-1.5">
                    <ArrowLeft className="h-3 w-3" /> Back to Community
                  </Button>
                </Link>
                <Link to="/dashboard/network">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs gap-1.5">
                    <Globe className="h-3 w-3" /> Explore Network
                  </Button>
                </Link>
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