import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Handshake, MessageCircle, Eye, Building2, Calendar } from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";

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
            <h1 className="text-2xl font-bold text-foreground font-serif">Research Collaborations</h1>
            <p className="text-sm text-muted-foreground mt-1">Initiate and manage collaborative research projects with academics.</p>
          </div>
          <Button variant="afrika" className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> New Collaboration
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>
        ) : collaborations.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <Handshake className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground">No collaborations yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Start a research collaboration with an academic partner.</p>
              <Button variant="afrika" className="mt-4 gap-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> Start Research Collaboration
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {collaborations.map(c => (
              <Card key={c.id} className="border-border">
                <CardContent className="py-5 px-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{c.title}</h3>
                        <Badge className={`text-[10px] ${statusColors[c.status] || statusColors.active}`}>{c.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{c.partner_institution}</span>
                        <Badge variant="secondary" className="text-[10px]">{c.research_area}</Badge>
                        {c.start_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(c.start_date).toLocaleDateString()}</span>}
                      </div>
                      {c.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.description}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="gap-1 text-xs"><Eye className="h-3 w-3" />View Project</Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs"><MessageCircle className="h-3 w-3" />Message Team</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Start Research Collaboration</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Project Title *</Label><Input className="mt-1" placeholder="e.g. Climate Adaptation Policy Study" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} /></div>
              <div><Label>Partner Institution *</Label><Input className="mt-1" placeholder="e.g. University of Cape Town" value={form.partner_institution} onChange={e => setForm(f => ({...f, partner_institution: e.target.value}))} /></div>
              <div><Label>Research Area *</Label><Input className="mt-1" placeholder="e.g. Climate Policy" value={form.research_area} onChange={e => setForm(f => ({...f, research_area: e.target.value}))} /></div>
              <div><Label>Project Description</Label><Textarea className="mt-1" rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></div>
              <div><Label>Expected Duration</Label><Input className="mt-1" placeholder="e.g. 6 months" value={form.expected_duration} onChange={e => setForm(f => ({...f, expected_duration: e.target.value}))} /></div>
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
