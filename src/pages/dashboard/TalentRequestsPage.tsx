import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Eye, Pencil, X } from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";

interface DisplayRequest {
  id: string;
  title: string;
  expertise_area: string;
  institution_name: string;
  created_at: string;
  status: string;
  description: string | null;
  expected_duration: string | null;
}

const sampleRequests: DisplayRequest[] = [
  {
    id: "sample-1",
    title: "Renewable Energy Policy Advisory",
    expertise_area: "Energy Policy Research",
    institution_name: "Ministry of Energy Ghana",
    created_at: "2026-03-01",
    status: "open",
    description: "Seeking an academic expert to assist with policy design and research for national renewable energy initiatives.",
    expected_duration: "3 months",
  },
  {
    id: "sample-2",
    title: "Agricultural Innovation Research",
    expertise_area: "Agricultural Economics",
    institution_name: "FAO Regional Office",
    created_at: "2026-02-20",
    status: "open",
    description: "Research partnership to evaluate climate-smart agriculture adoption in smallholder farming communities across West Africa.",
    expected_duration: "6 months",
  },
  {
    id: "sample-3",
    title: "Public Health Data Analysis",
    expertise_area: "Epidemiology & Biostatistics",
    institution_name: "WHO Africa Regional Office",
    created_at: "2026-02-10",
    status: "in_progress",
    description: "Statistical analysis of disease surveillance data across 12 African countries for the annual health report.",
    expected_duration: "2 months",
  },
  {
    id: "sample-4",
    title: "Digital Literacy Curriculum Design",
    expertise_area: "Education Technology",
    institution_name: "African Development Bank",
    created_at: "2026-01-15",
    status: "closed",
    description: "Curriculum development for digital skills training targeting youth in underserved communities.",
    expected_duration: "4 months",
  },
];

const statusColors: Record<string, string> = {
  open: "bg-afrika-green/10 text-afrika-green",
  closed: "bg-muted text-muted-foreground",
  in_progress: "bg-accent/10 text-accent",
};

const statusLabel: Record<string, string> = {
  open: "Open",
  closed: "Closed",
  in_progress: "In Progress",
};

const TalentRequestsPage = () => {
  const { talentRequests, loading, createTalentRequest, updateTalentRequest } = useInstitutional();
  const { unlockModule } = useModuleUnlocksContext();

  // Create dialog
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", institution_name: "", expertise_area: "", description: "", expected_duration: "" });
  const [saving, setSaving] = useState(false);

  // View dialog
  const [viewRequest, setViewRequest] = useState<DisplayRequest | null>(null);

  // Edit dialog
  const [editRequest, setEditRequest] = useState<DisplayRequest | null>(null);
  const [editForm, setEditForm] = useState({ title: "", institution_name: "", expertise_area: "", description: "", expected_duration: "" });
  const [editSaving, setEditSaving] = useState(false);

  // Close confirmation
  const [closeRequest, setCloseRequest] = useState<DisplayRequest | null>(null);

  const displayRequests: DisplayRequest[] = talentRequests.length > 0
    ? talentRequests.map(r => ({ ...r, description: r.description || null, expected_duration: r.expected_duration || null }))
    : sampleRequests;

  const isSample = (id: string) => id.startsWith("sample-");

  const handleCreate = async () => {
    if (!form.title || !form.institution_name || !form.expertise_area) return;
    setSaving(true);
    await createTalentRequest.mutateAsync(form);
    await unlockModule("institutional");
    setShowCreate(false);
    setForm({ title: "", institution_name: "", expertise_area: "", description: "", expected_duration: "" });
    setSaving(false);
  };

  const handleOpenEdit = (r: DisplayRequest) => {
    setEditForm({
      title: r.title,
      institution_name: r.institution_name,
      expertise_area: r.expertise_area,
      description: r.description || "",
      expected_duration: r.expected_duration || "",
    });
    setEditRequest(r);
  };

  const handleSaveEdit = async () => {
    if (!editRequest || isSample(editRequest.id)) return;
    if (!editForm.title || !editForm.institution_name || !editForm.expertise_area) return;
    setEditSaving(true);
    await updateTalentRequest.mutateAsync({ id: editRequest.id, ...editForm });
    setEditRequest(null);
    setEditSaving(false);
  };

  const handleConfirmClose = async () => {
    if (!closeRequest || isSample(closeRequest.id)) return;
    await updateTalentRequest.mutateAsync({ id: closeRequest.id, status: "closed" });
    setCloseRequest(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Talent Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Allow institutions to request academic expertise from the Afrika Scholar network.
            </p>
          </div>
          <Button variant="afrika" className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Create Talent Request
          </Button>
        </div>

        {/* Table */}
        <Card className="border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold">Request Title</TableHead>
                    <TableHead className="text-xs font-semibold">Expertise Required</TableHead>
                    <TableHead className="text-xs font-semibold">Institution</TableHead>
                    <TableHead className="text-xs font-semibold">Date Posted</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayRequests.map(r => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-foreground">{r.title}</p>
                          {r.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 max-w-[280px]">{r.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">{r.expertise_area}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.institution_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${statusColors[r.status] || statusColors.open}`}>
                          {statusLabel[r.status] || r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => setViewRequest(r)}>
                            <Eye className="h-3 w-3" /> View
                          </Button>
                          {r.status === "open" && (
                            <>
                              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => handleOpenEdit(r)}>
                                <Pencil className="h-3 w-3" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs gap-1 text-destructive hover:text-destructive"
                                onClick={() => setCloseRequest(r)}
                              >
                                <X className="h-3 w-3" /> Close
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Detail Dialog */}
      <Dialog open={!!viewRequest} onOpenChange={(open) => !open && setViewRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewRequest?.title}</DialogTitle>
            <DialogDescription>Talent request details</DialogDescription>
          </DialogHeader>
          {viewRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Institution</p>
                  <p className="text-sm font-medium text-foreground">{viewRequest.institution_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expertise Area</p>
                  <p className="text-sm font-medium text-foreground">{viewRequest.expertise_area}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expected Duration</p>
                  <p className="text-sm font-medium text-foreground">{viewRequest.expected_duration || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className={`text-[10px] ${statusColors[viewRequest.status] || statusColors.open}`}>
                    {statusLabel[viewRequest.status] || viewRequest.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date Posted</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(viewRequest.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              {viewRequest.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm text-foreground leading-relaxed">{viewRequest.description}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewRequest(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editRequest} onOpenChange={(open) => !open && setEditRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Talent Request</DialogTitle>
            <DialogDescription>Update the details of this talent request.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Request Title *</Label>
              <Input className="mt-1.5" value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Institution Name *</Label>
              <Input className="mt-1.5" value={editForm.institution_name} onChange={e => setEditForm(f => ({ ...f, institution_name: e.target.value }))} />
            </div>
            <div>
              <Label>Area of Expertise *</Label>
              <Input className="mt-1.5" value={editForm.expertise_area} onChange={e => setEditForm(f => ({ ...f, expertise_area: e.target.value }))} />
            </div>
            <div>
              <Label>Project Description</Label>
              <Textarea className="mt-1.5" rows={3} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Expected Duration</Label>
              <Input className="mt-1.5" value={editForm.expected_duration} onChange={e => setEditForm(f => ({ ...f, expected_duration: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRequest(null)}>Cancel</Button>
            <Button
              variant="afrika"
              onClick={handleSaveEdit}
              disabled={editSaving || !editForm.title || !editForm.institution_name || !editForm.expertise_area || isSample(editRequest?.id || "")}
            >
              {isSample(editRequest?.id || "") ? "Sample — Read Only" : editSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Confirmation */}
      <AlertDialog open={!!closeRequest} onOpenChange={(open) => !open && setCloseRequest(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this talent request?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark "{closeRequest?.title}" as closed. It will no longer appear as an active request. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isSample(closeRequest?.id || "")}
            >
              {isSample(closeRequest?.id || "") ? "Sample — Read Only" : "Close Request"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Talent Request</DialogTitle>
            <DialogDescription>Publish a new request for academic expertise.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Request Title *</Label>
              <Input className="mt-1.5" placeholder="e.g. Renewable Energy Policy Advisory" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Institution Name *</Label>
              <Input className="mt-1.5" placeholder="e.g. Ministry of Energy Ghana" value={form.institution_name} onChange={e => setForm(f => ({ ...f, institution_name: e.target.value }))} />
            </div>
            <div>
              <Label>Area of Expertise *</Label>
              <Input className="mt-1.5" placeholder="e.g. Energy Policy Research" value={form.expertise_area} onChange={e => setForm(f => ({ ...f, expertise_area: e.target.value }))} />
            </div>
            <div>
              <Label>Project Description</Label>
              <Textarea className="mt-1.5" rows={3} placeholder="Describe what academic expertise you need..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <Label>Expected Duration</Label>
              <Input className="mt-1.5" placeholder="e.g. 3 months" value={form.expected_duration} onChange={e => setForm(f => ({ ...f, expected_duration: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button variant="afrika" onClick={handleCreate} disabled={saving || !form.title || !form.institution_name || !form.expertise_area}>
              {saving ? "Publishing..." : "Publish Talent Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TalentRequestsPage;
