import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, BookOpen, Users, Eye, Trash2, Settings, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublishing, type EditorialBoardMember } from "@/hooks/usePublishing";
import { useAuth } from "@/contexts/AuthContext";

const JournalManagement = () => {
  const { myJournals, createJournal, getBoardMembers, addBoardMember, removeBoardMember } = usePublishing();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", issn: "", publisher: "", website_url: "" });
  const [saving, setSaving] = useState(false);

  // Board management
  const [boardJournalId, setBoardJournalId] = useState<string | null>(null);
  const [boardMembers, setBoardMembers] = useState<EditorialBoardMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ display_name: "", institution: "", role: "reviewer" });

  const loadBoard = async (journalId: string) => {
    setBoardJournalId(journalId);
    const members = await getBoardMembers(journalId);
    setBoardMembers(members);
  };

  const handleCreateJournal = async () => {
    if (!form.name) return;
    setSaving(true);
    await createJournal.mutateAsync(form);
    setShowCreate(false);
    setForm({ name: "", description: "", issn: "", publisher: "", website_url: "" });
    setSaving(false);
  };

  const handleAddMember = async () => {
    if (!boardJournalId || !memberForm.display_name) return;
    await addBoardMember.mutateAsync({
      journal_id: boardJournalId,
      user_id: user!.id,
      ...memberForm,
    });
    await loadBoard(boardJournalId);
    setShowAddMember(false);
    setMemberForm({ display_name: "", institution: "", role: "reviewer" });
  };

  const handleRemoveMember = async (id: string) => {
    await removeBoardMember.mutateAsync(id);
    if (boardJournalId) await loadBoard(boardJournalId);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Journal Management</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">Journal Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage journals, editorial boards, and publication workflows.</p>
          </div>
          <Button variant="afrika" className="gap-2" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Create Journal
          </Button>
        </div>

        {myJournals.length === 0 && !boardJournalId ? (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-semibold text-foreground">No journals managed yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Create a journal to start managing editorial workflows.</p>
              <Button variant="afrika" className="mt-4 gap-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> Create Your First Journal
              </Button>
            </CardContent>
          </Card>
        ) : boardJournalId ? (
          /* Board Management View */
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setBoardJournalId(null)}>← Back to Journals</Button>
              <h2 className="text-lg font-semibold text-foreground">Editorial Board</h2>
            </div>

            <div className="flex justify-end">
              <Button variant="afrikaOutline" size="sm" className="gap-1" onClick={() => setShowAddMember(true)}>
                <Plus className="h-3 w-3" /> Add Editor
              </Button>
            </div>

            {boardMembers.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-8 text-center">
                  <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No editorial board members yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {boardMembers.map(m => (
                  <Card key={m.id} className="border-border">
                    <CardContent className="py-4 px-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{m.display_name || "Unknown"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-[10px] capitalize">{m.role}</Badge>
                          {m.institution && <span className="text-xs text-muted-foreground">{m.institution}</span>}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-destructive gap-1" onClick={() => handleRemoveMember(m.id)}>
                        <Trash2 className="h-3 w-3" /> Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add Member Dialog */}
            <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle>Add Board Member</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Name *</Label><Input className="mt-1" value={memberForm.display_name} onChange={e => setMemberForm(f => ({...f, display_name: e.target.value}))} /></div>
                  <div><Label>Institution</Label><Input className="mt-1" value={memberForm.institution} onChange={e => setMemberForm(f => ({...f, institution: e.target.value}))} /></div>
                  <div>
                    <Label>Role</Label>
                    <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm" value={memberForm.role} onChange={e => setMemberForm(f => ({...f, role: e.target.value}))}>
                      <option value="editor">Editor</option>
                      <option value="associate_editor">Associate Editor</option>
                      <option value="reviewer">Reviewer</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddMember(false)}>Cancel</Button>
                  <Button variant="afrika" onClick={handleAddMember} disabled={!memberForm.display_name}>Add Member</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          /* Journal List */
          <div className="space-y-4">
            {myJournals.map(j => (
              <Card key={j.id} className="border-border">
                <CardContent className="py-5 px-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{j.name}</h3>
                      {j.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{j.description}</p>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {j.issn && <span>ISSN: {j.issn}</span>}
                        {j.publisher && <span>Publisher: {j.publisher}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => loadBoard(j.id)}>
                        <Users className="h-3 w-3" /> Manage Board
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-xs">
                        <Eye className="h-3 w-3" /> View Submissions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Journal Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Journal</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Journal Name *</Label><Input className="mt-1" placeholder="e.g. African Journal of Public Health" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
              <div><Label>Description</Label><Textarea className="mt-1" rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>ISSN</Label><Input className="mt-1" placeholder="e.g. 1234-5678" value={form.issn} onChange={e => setForm(f => ({...f, issn: e.target.value}))} /></div>
                <div><Label>Publisher</Label><Input className="mt-1" value={form.publisher} onChange={e => setForm(f => ({...f, publisher: e.target.value}))} /></div>
              </div>
              <div><Label>Website URL</Label><Input className="mt-1" placeholder="https://..." value={form.website_url} onChange={e => setForm(f => ({...f, website_url: e.target.value}))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button variant="afrika" onClick={handleCreateJournal} disabled={saving || !form.name}>
                {saving ? "Creating..." : "Create Journal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default JournalManagement;
