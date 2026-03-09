import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight, Handshake, MapPin, Beaker, Users,
  MessageCircle, ArrowRight, Briefcase,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollabRequest {
  id: number;
  title: string;
  author: string;
  researchField: string;
  requiredExpertise: string;
  collaborationType: string;
  description: string;
  postedAt: string;
  applicants: number;
}

const collabRequests: CollabRequest[] = [
  {
    id: 1, title: "Co-researchers on urban food systems in West Africa",
    author: "@dimayo", researchField: "Food Security", requiredExpertise: "Data Analysis, Field Research",
    collaborationType: "Field Research", description: "Looking for researchers with expertise in food security, urban planning, or agricultural economics.",
    postedAt: "2026-02-25", applicants: 4,
  },
  {
    id: 2, title: "Econometric analysis partner for agricultural credit dataset",
    author: "@hassanb07", researchField: "Agricultural Economics", requiredExpertise: "Econometrics, ARDL",
    collaborationType: "Data Analysis", description: "Need a co-researcher for advanced econometric modeling on a 24-year panel dataset.",
    postedAt: "2026-02-20", applicants: 2,
  },
  {
    id: 3, title: "Literature review collaboration on digital library management",
    author: "@fresource2021", researchField: "Library Science", requiredExpertise: "Systematic Review, Meta-analysis",
    collaborationType: "Literature Review", description: "Seeking collaborators for a comprehensive literature review on digital resource management in medical libraries.",
    postedAt: "2026-02-18", applicants: 1,
  },
  {
    id: 4, title: "Climate adaptation policy framework for ECOWAS nations",
    author: "Dr. Tunde Adeyemi", researchField: "Climate Policy", requiredExpertise: "Policy Analysis, Environmental Science",
    collaborationType: "Field Research", description: "Multi-country study on climate adaptation strategies. Looking for researchers across West Africa.",
    postedAt: "2026-02-15", applicants: 6,
  },
];

const CommunityCollaborationsPage = () => {
  const { toast } = useToast();

  const handleApply = (title: string) => {
    toast({ title: "Application sent!", description: `You've applied to collaborate on "${title}".` });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/community" className="hover:text-foreground">Community</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Collaboration Requests</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Collaboration Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">Find research partnership opportunities and connect with fellow academics.</p>
        </div>

        <div className="space-y-4">
          {collabRequests.map((req) => (
            <div key={req.id} className="bg-card rounded-xl border border-border p-5 space-y-3 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground">{req.title}</h3>
                  <Link to={`/dashboard/researcher?user=${encodeURIComponent(req.author)}`} className="text-xs text-accent hover:underline mt-0.5 inline-block">
                    {req.author}
                  </Link>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-3">{req.postedAt}</span>
              </div>

              <p className="text-xs text-muted-foreground">{req.description}</p>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-[10px] bg-secondary text-foreground gap-1">
                  <MapPin className="h-2.5 w-2.5" /> {req.researchField}
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-secondary text-foreground gap-1">
                  <Beaker className="h-2.5 w-2.5" /> {req.requiredExpertise}
                </Badge>
                <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent border-accent/30 gap-1">
                  <Handshake className="h-2.5 w-2.5" /> {req.collaborationType}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" /> {req.applicants} applicant{req.applicants !== 1 ? "s" : ""}
                </span>
                <div className="flex gap-2">
                  <Link to={`/dashboard/researcher?user=${encodeURIComponent(req.author)}`}>
                    <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                      <MessageCircle className="h-3 w-3" /> Message Author
                    </Button>
                  </Link>
                  <Button variant="afrikaOutline" size="sm" className="text-xs gap-1 h-7" onClick={() => handleApply(req.title)}>
                    <Handshake className="h-3 w-3" /> Apply to Collaborate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CommunityCollaborationsPage;