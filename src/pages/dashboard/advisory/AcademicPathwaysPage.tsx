import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Compass, ArrowRight, GraduationCap, BookOpen, Briefcase, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Pathway {
  id: string;
  title: string;
  description: string;
  steps: string[];
  category: string;
}

const pathways: Pathway[] = [
  {
    id: "pw1",
    title: "Data Science Research Career",
    description: "A structured path from undergraduate statistics to a PhD in Artificial Intelligence.",
    steps: ["Bachelor's in Statistics", "Master's in Data Science", "PhD in Artificial Intelligence"],
    category: "Research",
  },
  {
    id: "pw2",
    title: "Public Health Leadership",
    description: "Progress from health sciences into policy leadership and global health advisory roles.",
    steps: ["Bachelor's in Public Health", "Master's in Epidemiology", "DrPH or Health Policy Fellowship"],
    category: "Clinical & Policy",
  },
  {
    id: "pw3",
    title: "Engineering to Academia",
    description: "Transition from engineering practice into academic research and teaching.",
    steps: ["Bachelor's in Engineering", "Industry Experience (2-3 years)", "Master's in Engineering Research", "PhD in Specialization"],
    category: "STEM",
  },
  {
    id: "pw4",
    title: "Law & Governance Track",
    description: "Build expertise in African governance, constitutional law, and policy advisory.",
    steps: ["LLB or BA in Law", "LLM in International Law", "Governance Research Fellowship"],
    category: "Humanities",
  },
  {
    id: "pw5",
    title: "Education Leadership",
    description: "Advance from classroom teaching into educational leadership and curriculum design.",
    steps: ["Bachelor's in Education", "Master's in Educational Leadership", "EdD or Policy Advisory Role"],
    category: "Education",
  },
  {
    id: "pw6",
    title: "Undergraduate to Master's",
    description: "General guidance for transitioning from an undergraduate degree to a master's program in Africa.",
    steps: ["Complete Bachelor's Degree", "Identify Research Interest", "Apply to Master's Programs", "Secure Funding"],
    category: "General",
  },
];

const categoryColors: Record<string, string> = {
  Research: "bg-accent/10 text-accent",
  "Clinical & Policy": "bg-afrika-green/10 text-afrika-green",
  STEM: "bg-primary/10 text-primary",
  Humanities: "bg-afrika-orange-light text-afrika-orange",
  Education: "bg-secondary text-secondary-foreground",
  General: "bg-muted text-muted-foreground",
};

const AcademicPathwaysPage = () => {
  const [viewPathway, setViewPathway] = useState<Pathway | null>(null);

  const handleRequestGuidance = (p: Pathway) => {
    toast.success(`Guidance request submitted for "${p.title}"`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academic Pathway Guidance</h1>
          <p className="text-sm text-muted-foreground mt-1">Explore structured pathways for academic progression and career advancement.</p>
        </div>

        {/* Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pathways.map(p => (
            <Card key={p.id} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-start justify-between mb-3">
                  <Compass className="h-5 w-5 text-accent" />
                  <Badge className={`text-[10px] ${categoryColors[p.category] || ""}`}>{p.category}</Badge>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">{p.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{p.description}</p>

                {/* Steps preview */}
                <div className="space-y-1.5 mb-4">
                  {p.steps.slice(0, 3).map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="h-5 w-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">{i + 1}</div>
                      <span className="text-foreground">{step}</span>
                    </div>
                  ))}
                  {p.steps.length > 3 && (
                    <p className="text-[10px] text-muted-foreground ml-7">+{p.steps.length - 3} more steps</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="afrikaOutline" size="sm" className="text-xs flex-1" onClick={() => setViewPathway(p)}>
                    View Details
                  </Button>
                  <Button variant="afrika" size="sm" className="text-xs flex-1 gap-1" onClick={() => handleRequestGuidance(p)}>
                    Request Guidance
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewPathway} onOpenChange={(open) => !open && setViewPathway(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{viewPathway?.title}</DialogTitle></DialogHeader>
          {viewPathway && (
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">{viewPathway.description}</p>
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Pathway Steps</p>
                <div className="space-y-2">
                  {viewPathway.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent shrink-0">{i + 1}</div>
                      <div className="flex-1 border-b border-border pb-2">
                        <p className="text-foreground font-medium">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="afrika" size="sm" className="flex-1 gap-1" onClick={() => { handleRequestGuidance(viewPathway); setViewPathway(null); }}>
                  <Compass className="h-3 w-3" /> Request Guidance
                </Button>
                <Link to="/dashboard/messages" className="flex-1">
                  <Button variant="afrikaOutline" size="sm" className="w-full gap-1">
                    <MessageCircle className="h-3 w-3" /> Message Advisor
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AcademicPathwaysPage;
