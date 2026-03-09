import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Handshake, Users2, Building2, Compass, TrendingUp,
  Briefcase, GraduationCap, FileText, Globe, UserPlus,
} from "lucide-react";
import CommunityPreview from "@/components/dashboard/CommunityPreview";

const collaborations = [
  { title: "EdTech Research Partnership", partner: "Dr. Amina Osei, University of Ghana", status: "Active" },
  { title: "Policy Impact Study", partner: "ECOWAS Research Unit", status: "Active" },
];

const opportunities = [
  { title: "AI Ethics Consulting — University of Nairobi", type: "Consulting", deadline: "Mar 20, 2026" },
  { title: "EdTech Curriculum Advisor — Lagos Business School", type: "Advisory", deadline: "Apr 5, 2026" },
];

const lecturerRequests = [
  { title: "Short Course: Data Analytics for Policy Makers", institution: "Kenyatta University", type: "Short Course" },
  { title: "Research Consulting: Fintech Regulation Study", institution: "Central Bank of Nigeria", type: "Research Consulting" },
];

const trendingTopics = [
  { topic: "AI Ethics in Education", papers: 142 },
  { topic: "Climate Finance in Africa", papers: 98 },
  { topic: "Digital Health Infrastructure", papers: 76 },
];

const networkHighlights = [
  { name: "Dr. Kwame Asante", institution: "University of Cape Town", field: "Public Health" },
  { name: "Prof. Fatima Diallo", institution: "Université Cheikh Anta Diop", field: "Agricultural Science" },
];

const statusColors: Record<string, string> = {
  Active: "bg-afrika-green/10 text-afrika-green",
  Consulting: "bg-primary/10 text-primary",
  Advisory: "bg-accent/10 text-accent",
  "Short Course": "bg-primary/10 text-primary",
  "Research Consulting": "bg-accent/10 text-accent",
};

export default function ProfessionalDashboard() {
  return (
    <div className="space-y-8">
      {/* Active Collaborations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Active Collaborations</h2>
          <Link to="/dashboard/network/engagements">
            <Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {collaborations.map((c, i) => (
            <Link key={i} to="/dashboard/network/engagements" className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className={`text-[10px] ${statusColors[c.status]}`}>{c.status}</Badge>
                  <span className="text-xs text-muted-foreground">{c.partner}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* Research Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Research Opportunities</h2>
          <Link to="/dashboard/network/opportunities">
            <Button variant="ghost" size="sm" className="text-xs gap-1">Browse All <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
        <div className="space-y-3">
          {opportunities.map((o, i) => (
            <Link key={i} to="/dashboard/network/opportunities" className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-sm transition-shadow block">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{o.title}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className={`text-[10px] ${statusColors[o.type]}`}>{o.type}</Badge>
                  <span className="text-xs text-muted-foreground">Deadline: {o.deadline}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* Lecturer Requests */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Lecturer Requests</h2>
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {lecturerRequests.map((r, i) => (
            <Link key={i} to="/dashboard/advisory" className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className={`text-[10px] ${statusColors[r.type]}`}>{r.type}</Badge>
                  <span className="text-xs text-muted-foreground">{r.institution}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* Research Discovery + Network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Research Discovery</h2>
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Trending Topics</p>
            {trendingTopics.map((t) => (
              <Link key={t.topic} to="/dashboard/intelligence?tab=trends" className="flex items-center justify-between hover:bg-secondary/30 rounded-lg p-1 -m-1 transition-colors">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="text-sm text-foreground">{t.topic}</span>
                </div>
                <span className="text-xs text-muted-foreground">{t.papers} papers</span>
              </Link>
            ))}
            <Link to="/dashboard/intelligence">
              <Button variant="afrikaOutline" size="sm" className="w-full mt-2 text-xs">Explore Intelligence Hub</Button>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Network Highlights</h2>
          <div className="bg-card rounded-xl border border-border p-5 space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Featured Experts</p>
            {networkHighlights.map((n) => (
              <div key={n.name} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <UserPlus className="h-3.5 w-3.5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{n.name}</p>
                  <p className="text-xs text-muted-foreground">{n.institution} · {n.field}</p>
                </div>
              </div>
            ))}
            <Link to="/dashboard/network/directory">
              <Button variant="afrikaOutline" size="sm" className="w-full mt-2 text-xs">Browse Directory</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Institution Partnerships */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Institution Partnerships</h2>
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">University of Lagos — Research Collaboration</p>
              <p className="text-xs text-muted-foreground">Looking for industry partners in health tech</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Makerere University — Data Partnership</p>
              <p className="text-xs text-muted-foreground">Seeking data analytics partners for agricultural research</p>
            </div>
          </div>
          <Link to="/dashboard/institutional">
            <Button variant="afrikaOutline" size="sm" className="w-full mt-2 text-xs">View All Partnerships</Button>
          </Link>
        </div>
      </div>

      {/* Community */}
      <CommunityPreview />
    </div>
  );
}
