import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Handshake, MessageCircle, Eye, Building2, Calendar, ArrowRight } from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";

interface CollabDisplay {
  id: string;
  title: string;
  partner_institution: string;
  research_area: string;
  status: string;
  start_date: string | null;
  description: string | null;
  expected_duration: string | null;
}

const sampleCollaborations: CollabDisplay[] = [
  {
    id: "sc-1",
    title: "Climate Adaptation Policy Study",
    partner_institution: "University of Cape Town",
    research_area: "Climate Policy",
    status: "active",
    start_date: "2026-02-01",
    description: "Joint research initiative examining climate resilience strategies in coastal African cities.",
    expected_duration: "6 months",
  },
  {
    id: "sc-2",
    title: "Digital Health Infrastructure Assessment",
    partner_institution: "University of Nairobi",
    research_area: "Health Informatics",
    status: "active",
    start_date: "2026-01-15",
    description: "Evaluating the readiness of health systems for digital transformation across East African countries.",
    expected_duration: "8 months",
  },
  {
    id: "sc-3",
    title: "Pan-African Education Quality Index",
    partner_institution: "University of Ibadan",
    research_area: "Education Policy",
    status: "pending",
    start_date: null,
    description: "Developing a standardized metric for measuring education quality across African universities.",
    expected_duration: "12 months",
  },
  {
    id: "sc-4",
    title: "Renewable Energy Adoption Study",
    partner_institution: "University of Ghana",
    research_area: "Energy Economics",
    status: "completed",
    start_date: "2025-06-01",
    description: "Comprehensive analysis of solar and wind energy adoption barriers in West African nations.",
    expected_duration: "9 months",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-afrika-green/10 text-afrika-green",
  completed: "bg-muted text-muted-foreground",
  pending: "bg-accent/10 text-accent",
};

const ProjectCollaborationsPage = () => {
  const { collaborations, loading, createCollaboration } = useInstitutional();
  const { unlockModule } = useModuleUnlocksContext();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", partner_institution: "", research_area: "", description: "", expected_duration: "", start_date: null as string | null,
  });
  const [saving, setSaving] = useState(false);

  const displayCollabs: CollabDisplay[] = collaborations.length > 0
    ? collaborations.map(c => ({ ...c, description: c.description || null, expected_duration: c.expected_duration || null }))
    : sampleCollaborations;

  const handleCreate = async () => {
    if (!form.title || !form.partner_institution || !form.research_area) return;
    setSaving(true);
    await createCollaboration.mutateAsync(form);
    await unlockModule("institutional");
    setShowCreate(false);
    setForm({ title: "", partner_institution: "", research_area: "", description: "", expected_duration: "", start_date: null });
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Research Collaborations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Initiate and manage collaborative research projects with academics.
            </p>
          </div>
          <Button variant="afrika" className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Start Collaboration
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayCollabs.map(c => (
              <Card key={c.id} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="py-5 px-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground">{c.title}</h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />{c.partner_institution}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">{c.research_area}</Badge>
                      </div>
                    </div>
                    <Badge className={`text-[10px] shrink-0 ${statusColors[c.status] || statusColors.active}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </Badge>
                  </div>

                  {c.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {c.start_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Started {new Date(c.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                    )}
                    {c.expected_duration && (
                      <span>Duration: {c.expected_duration}</span>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button variant="outline" size="sm" className="gap-1 text-xs flex-1">
                      <Eye className="h-3 w-3" /> View Project
                    </Button>
                    <Link to="/dashboard/messages" className="flex-1">
                      <Button variant="ghost" size="sm" className="gap-1 text-xs w-full">
                        <MessageCircle className="h-3 w-3" /> Message Team
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Start Research Collaboration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Project Title *</Label>
                <Input className="mt-1.5" placeholder="e.g. Climate Adaptation Policy Study" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <Label>Partner Institution *</Label>
                <Input className="mt-1.5" placeholder="e.g. University of Cape Town" value={form.partner_institution} onChange={e => setForm(f => ({ ...f, partner_institution: e.target.value }))} />
              </div>
              <div>
                <Label>Research Area *</Label>
                <Input className="mt-1.5" placeholder="e.g. Climate Policy" value={form.research_area} onChange={e => setForm(f => ({ ...f, research_area: e.target.value }))} />
              </div>
              <div>
                <Label>Project Description</Label>
                <Textarea className="mt-1.5" rows={3} placeholder="Describe the research objectives and scope..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <Label>Expected Duration</Label>
                <Input className="mt-1.5" placeholder="e.g. 6 months" value={form.expected_duration} onChange={e => setForm(f => ({ ...f, expected_duration: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button variant="afrika" onClick={handleCreate} disabled={saving || !form.title || !form.partner_institution || !form.research_area}>
                {saving ? "Creating..." : "Create Collaboration"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ProjectCollaborationsPage;
