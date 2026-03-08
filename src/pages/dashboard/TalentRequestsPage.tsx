import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, FileText, Users, Pencil, X, Eye } from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";

const statusColors: Record<string, string> = {
  open: "bg-afrika-green/10 text-afrika-green",
  closed: "bg-muted text-muted-foreground",
  in_progress: "bg-accent/10 text-accent",
};

const TalentRequestsPage = () => {
  const { talentRequests, loading, createTalentRequest, updateTalentRequest } = useInstitutional();
  const { unlockModule } = useModuleUnlocksContext();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", institution_name: "", expertise_area: "", description: "", expected_duration: "",
  });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.title || !form.institution_name || !form.expertise_area) return;
    setSaving(true);
    await createTalentRequest.mutateAsync(form);
    await unlockModule("institutional");
    setShowCreate(false);
    setForm({ title: "", institution_name: "", expertise_area: "", description: "", expected_duration: "" });
    setSaving(false);
  };

  const handleClose = async (id: string) => {
    await updateTalentRequest.mutateAsync({ id, status: "closed" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Talent Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">Request academic experts for your institutional projects.</p>
          </div>
          <Button variant="afrika" className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> New Request
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />)}</div>
        ) : talentRequests.length === 0 ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground">No talent requests yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Publish your first request to find academic experts.</p>
              <Button variant="afrika" className="mt-4 gap-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> Request Academic Talent
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {talentRequests.map(r => (
              <Card key={r.id} className="border-border">
                <CardContent className="py-5 px-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{r.title}</h3>
                        <Badge className={`text-[10px] ${statusColors[r.status] || statusColors.open}`}>
                          {r.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{r.institution_name}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-[10px]">{r.expertise_area}</Badge>
                        {r.expected_duration && (
                          <span className="text-xs text-muted-foreground">Duration: {r.expected_duration}</span>
                        )}
                      </div>
                      {r.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{r.description}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="gap-1 text-xs"><Eye className="h-3 w-3" />View Applicants</Button>
                      {r.status === "open" && (
                        <Button variant="ghost" size="sm" className="gap-1 text-xs text-destructive" onClick={() => handleClose(r.id)}>
                          <X className="h-3 w-3" />Close
                        </Button>
                      )}
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
            <DialogHeader><DialogTitle>Request Academic Talent</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Request Title *</Label><Input className="mt-1" placeholder="e.g. Renewable Energy Policy Advisory" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} /></div>
              <div><Label>Institution Name *</Label><Input className="mt-1" placeholder="e.g. Ministry of Energy Ghana" value={form.institution_name} onChange={e => setForm(f => ({...f, institution_name: e.target.value}))} /></div>
              <div><Label>Area of Expertise *</Label><Input className="mt-1" placeholder="e.g. Energy Policy Research" value={form.expertise_area} onChange={e => setForm(f => ({...f, expertise_area: e.target.value}))} /></div>
              <div><Label>Project Description</Label><Textarea className="mt-1" rows={3} placeholder="Describe what you need..." value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></div>
              <div><Label>Expected Duration</Label><Input className="mt-1" placeholder="e.g. 3 months" value={form.expected_duration} onChange={e => setForm(f => ({...f, expected_duration: e.target.value}))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button variant="afrika" onClick={handleCreate} disabled={saving || !form.title || !form.institution_name || !form.expertise_area}>
                {saving ? "Publishing..." : "Publish Talent Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TalentRequestsPage;
