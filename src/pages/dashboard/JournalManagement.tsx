import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, BookOpen, Users, Eye, Trash2, ChevronRight, FileText,
  Globe, Hash, Building, UserPlus, Send, Calendar, BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { usePublishing, type Journal, type EditorialBoardMember } from "@/hooks/usePublishing";
import { useAuth } from "@/contexts/AuthContext";

// Demo metrics per journal
const demoMetrics: Record<string, { submissions: number; underReview: number; accepted: number; published: number }> = {};
const getMetrics = (id: string) => demoMetrics[id] || { submissions: 24, underReview: 12, accepted: 6, published: 45 };

// Demo submissions for journal
const demoJournalSubmissions = [
  { title: "Renewable Energy Policy Framework in West Africa", author: "Dr. Kofi Mensah", date: "Mar 1, 2026", status: "Peer Review" },
  { title: "AI-Assisted Epidemiological Modeling", author: "Dr. Ama Mensah", date: "Mar 2, 2026", status: "Under Review" },
  { title: "Climate Policy Innovation in West Africa", author: "Dr. Ibrahim Sadiq", date: "Feb 28, 2026", status: "Accepted" },
  { title: "Agricultural Data Systems in East Africa", author: "Dr. Grace Nwoye", date: "Feb 25, 2026", status: "Published" },
];

// Demo issues
const demoIssues = [
  {
    volume: 12, issue: 2, year: 2026, status: "In Progress",
    articles: ["AI-Assisted Epidemiological Modeling", "Climate Policy Innovation in West Africa"],
  },
  {
    volume: 12, issue: 1, year: 2026, status: "Published",
    articles: ["Agricultural Data Systems in East Africa", "Health Infrastructure in Rural Nigeria"],
  },
];

const JournalManagement = () => {
  const { myJournals, submissions, createJournal, getBoardMembers, addBoardMember, removeBoardMember } = usePublishing();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", issn: "", publisher: "", website_url: "" });
  const [saving, setSaving] = useState(false);

  // Journal detail view
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Board management
  const [boardMembers, setBoardMembers] = useState<EditorialBoardMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ display_name: "", institution: "", role: "reviewer" });

  const loadBoard = async (journalId: string) => {
    const members = await getBoardMembers(journalId);
    setBoardMembers(members);
  };

  useEffect(() => {
    if (selectedJournal) {
      loadBoard(selectedJournal.id);
    }
  }, [selectedJournal?.id]);

  const handleCreateJournal = async () => {
    if (!form.name) return;
    setSaving(true);
    await createJournal.mutateAsync(form);
    setShowCreate(false);
    setForm({ name: "", description: "", issn: "", publisher: "", website_url: "" });
    setSaving(false);
  };

  const handleAddMember = async () => {
    if (!selectedJournal || !memberForm.display_name) return;
    await addBoardMember.mutateAsync({
      journal_id: selectedJournal.id,
      user_id: user!.id,
      ...memberForm,
    });
    await loadBoard(selectedJournal.id);
    setShowAddMember(false);
    setMemberForm({ display_name: "", institution: "", role: "reviewer" });
  };

  const handleRemoveMember = async (id: string) => {
    await removeBoardMember.mutateAsync(id);
    if (selectedJournal) await loadBoard(selectedJournal.id);
  };

  const editors = boardMembers.filter(m => m.role === "editor" || m.role === "associate_editor");
  const reviewers = boardMembers.filter(m => m.role === "reviewer");

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
          <ChevronRight className="h-3 w-3" />
          {selectedJournal ? (
            <>
              <button onClick={() => setSelectedJournal(null)} className="hover:text-foreground">
                Journal Management
              </button>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{selectedJournal.name}</span>
            </>
          ) : (
            <span className="text-foreground font-medium">Journal Management</span>
          )}
        </div>

        {/* ===== Journal Detail View ===== */}
        {selectedJournal ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-xs" onClick={() => setSelectedJournal(null)}>
                  ← Back to Journals
                </Button>
                <h1 className="text-2xl font-bold text-foreground font-serif">{selectedJournal.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{selectedJournal.description || "No description available."}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Submissions This Month", value: getMetrics(selectedJournal.id).submissions, icon: FileText, color: "text-primary" },
                { label: "Under Review", value: getMetrics(selectedJournal.id).underReview, icon: Clock, color: "text-accent" },
                { label: "Accepted Papers", value: getMetrics(selectedJournal.id).accepted, icon: CheckCircle, color: "text-afrika-green" },
                { label: "Published Articles", value: getMetrics(selectedJournal.id).published, icon: BookOpen, color: "text-afrika-orange" },
              ].map(s => (
                <Card key={s.label} className="border-border">
                  <CardContent className="pt-5 pb-4 px-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                      </div>
                      <div className={`h-10 w-10 rounded-lg bg-secondary flex items-center justify-center ${s.color}`}>
                        <s.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="board">Editorial Board</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 mt-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Journal Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedJournal.issn && (
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">ISSN</p>
                            <p className="text-sm font-medium text-foreground">{selectedJournal.issn}</p>
                          </div>
                        </div>
                      )}
                      {selectedJournal.publisher && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Publisher</p>
                            <p className="text-sm font-medium text-foreground">{selectedJournal.publisher}</p>
                          </div>
                        </div>
                      )}
                      {selectedJournal.website_url && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Website</p>
                            <a href={selectedJournal.website_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-accent hover:underline">
                              {selectedJournal.website_url}
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Created</p>
                          <p className="text-sm font-medium text-foreground">
                            {new Date(selectedJournal.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedJournal.description && (
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-1">Description</p>
                        <p className="text-sm text-foreground">{selectedJournal.description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Submission Guidelines (placeholder) */}
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Submission Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                      <li>Manuscripts must be original and not under review elsewhere.</li>
                      <li>Submit in PDF format with all figures embedded.</li>
                      <li>Include an abstract of no more than 300 words.</li>
                      <li>Follow APA 7th edition citation style.</li>
                      <li>Cover letter required with all submissions.</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Submissions Tab */}
              <TabsContent value="submissions" className="mt-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Journal Submissions</CardTitle>
                    <CardDescription>All manuscripts submitted to this journal.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Paper Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Submission Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {demoJournalSubmissions.map((s, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium max-w-[200px]">
                              <p className="line-clamp-1">{s.title}</p>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs">{s.author}</TableCell>
                            <TableCell className="text-muted-foreground text-xs">{s.date}</TableCell>
                            <TableCell>
                              <Badge
                                className={`text-[10px] ${
                                  s.status === "Accepted" ? "bg-afrika-green/10 text-afrika-green" :
                                  s.status === "Published" ? "bg-primary/10 text-primary" :
                                  "bg-secondary text-secondary-foreground"
                                }`}
                              >
                                {s.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                  <Eye className="h-3 w-3" /> View
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                  <UserPlus className="h-3 w-3" /> Assign
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                  <Send className="h-3 w-3" /> Decision
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Editorial Board Tab */}
              <TabsContent value="board" className="space-y-4 mt-4">
                <div className="flex justify-end">
                  <Button variant="afrikaOutline" size="sm" className="gap-1" onClick={() => setShowAddMember(true)}>
                    <Plus className="h-3 w-3" /> Add Member
                  </Button>
                </div>

                {boardMembers.length === 0 ? (
                  <Card className="border-border">
                    <CardContent className="py-12 text-center">
                      <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <h3 className="font-semibold text-foreground">No editorial board members yet.</h3>
                      <p className="text-sm text-muted-foreground mt-1">Add editors and reviewers to manage this journal.</p>
                      <Button variant="afrika" className="mt-4 gap-2" onClick={() => setShowAddMember(true)}>
                        <Plus className="h-4 w-4" /> Add Your First Member
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Editors Section */}
                    {editors.length > 0 && (
                      <Card className="border-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base font-semibold">Editors</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {editors.map(m => (
                            <div key={m.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{m.display_name || "Unknown"}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Badge variant="secondary" className="text-[10px] capitalize">{m.role.replace("_", " ")}</Badge>
                                    {m.institution && <span className="text-xs text-muted-foreground">{m.institution}</span>}
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="text-destructive gap-1 text-xs" onClick={() => handleRemoveMember(m.id)}>
                                <Trash2 className="h-3 w-3" /> Remove
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Reviewers Section */}
                    {reviewers.length > 0 && (
                      <Card className="border-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base font-semibold">Reviewers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {reviewers.map(m => (
                            <div key={m.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center">
                                  <Users className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{m.display_name || "Unknown"}</p>
                                  {m.institution && <span className="text-xs text-muted-foreground">{m.institution}</span>}
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="text-destructive gap-1 text-xs" onClick={() => handleRemoveMember(m.id)}>
                                <Trash2 className="h-3 w-3" /> Remove
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>

              {/* Issues Tab */}
              <TabsContent value="issues" className="space-y-4 mt-4">
                <div className="flex justify-end">
                  <Button variant="afrikaOutline" size="sm" className="gap-1">
                    <Plus className="h-3 w-3" /> Create Issue
                  </Button>
                </div>

                {demoIssues.map((iss, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="py-5 px-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-foreground">
                              Volume {iss.volume} — Issue {iss.issue} ({iss.year})
                            </h3>
                            <p className="text-xs text-muted-foreground">{iss.articles.length} articles</p>
                          </div>
                        </div>
                        <Badge className={`text-[10px] ${
                          iss.status === "Published" ? "bg-afrika-green/10 text-afrika-green" : "bg-accent/10 text-accent"
                        }`}>
                          {iss.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 pl-[52px]">
                        {iss.articles.map((a, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm">
                            <FileText className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="text-foreground">{a}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3 pl-[52px]">
                        <Button variant="outline" size="sm" className="text-xs gap-1">
                          <Plus className="h-3 w-3" /> Add Article
                        </Button>
                        {iss.status !== "Published" && (
                          <Button variant="afrika" size="sm" className="text-xs gap-1">
                            <Send className="h-3 w-3" /> Publish Issue
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          /* ===== Journal List View ===== */
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-serif">Journal Management</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage journals, editorial boards, and publication workflows.</p>
              </div>
              <Button variant="afrika" className="gap-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> Create Journal
              </Button>
            </div>

            {myJournals.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-16 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground">You are not currently managing any journals.</h3>
                  <p className="text-sm text-muted-foreground mt-1">Create a journal or apply to become an editor.</p>
                  <div className="flex justify-center gap-3 mt-4">
                    <Button variant="afrika" className="gap-2" onClick={() => setShowCreate(true)}>
                      <Plus className="h-4 w-4" /> Create Your First Journal
                    </Button>
                    <Button variant="afrikaOutline" className="gap-2">
                      Apply to Become an Editor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myJournals.map(j => {
                  const m = getMetrics(j.id);
                  return (
                    <Card key={j.id} className="border-border hover:border-accent/40 transition-colors">
                      <CardContent className="py-5 px-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground">{j.name}</h3>
                              <Badge variant="secondary" className="text-[10px]">Editor</Badge>
                            </div>
                            {j.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{j.description}</p>
                            )}

                            {/* Metrics row */}
                            <div className="flex items-center gap-4 mt-3">
                              <div className="text-center">
                                <p className="text-lg font-bold text-foreground">{m.submissions}</p>
                                <p className="text-[10px] text-muted-foreground">Submissions</p>
                              </div>
                              <div className="h-8 w-px bg-border" />
                              <div className="text-center">
                                <p className="text-lg font-bold text-foreground">{m.underReview}</p>
                                <p className="text-[10px] text-muted-foreground">Under Review</p>
                              </div>
                              <div className="h-8 w-px bg-border" />
                              <div className="text-center">
                                <p className="text-lg font-bold text-foreground">{m.accepted}</p>
                                <p className="text-[10px] text-muted-foreground">Accepted</p>
                              </div>
                              <div className="h-8 w-px bg-border" />
                              <div className="text-center">
                                <p className="text-lg font-bold text-foreground">{m.published}</p>
                                <p className="text-[10px] text-muted-foreground">Published</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              {j.issn && <span>ISSN: {j.issn}</span>}
                              {j.publisher && <span>Publisher: {j.publisher}</span>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <Button variant="afrika" size="sm" className="gap-1 text-xs" onClick={() => { setSelectedJournal(j); setActiveTab("overview"); }}>
                              <Eye className="h-3 w-3" /> View Journal
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => { setSelectedJournal(j); setActiveTab("board"); }}>
                              <Users className="h-3 w-3" /> Manage Board
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => { setSelectedJournal(j); setActiveTab("submissions"); }}>
                              <FileText className="h-3 w-3" /> View Submissions
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Create Journal Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Journal</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Journal Name *</Label>
                <Input className="mt-1" placeholder="e.g. African Journal of Public Health" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea className="mt-1" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>ISSN</Label><Input className="mt-1" placeholder="e.g. 1234-5678" value={form.issn} onChange={e => setForm(f => ({ ...f, issn: e.target.value }))} /></div>
                <div><Label>Publisher</Label><Input className="mt-1" value={form.publisher} onChange={e => setForm(f => ({ ...f, publisher: e.target.value }))} /></div>
              </div>
              <div><Label>Website URL</Label><Input className="mt-1" placeholder="https://..." value={form.website_url} onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button variant="afrika" onClick={handleCreateJournal} disabled={saving || !form.name}>
                {saving ? "Creating..." : "Create Journal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Member Dialog */}
        <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Add Board Member</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name *</Label><Input className="mt-1" value={memberForm.display_name} onChange={e => setMemberForm(f => ({ ...f, display_name: e.target.value }))} /></div>
              <div><Label>Institution</Label><Input className="mt-1" value={memberForm.institution} onChange={e => setMemberForm(f => ({ ...f, institution: e.target.value }))} /></div>
              <div>
                <Label>Role</Label>
                <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm" value={memberForm.role} onChange={e => setMemberForm(f => ({ ...f, role: e.target.value }))}>
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
    </DashboardLayout>
  );
};

// Need these icons used in the metrics section inside detail view
import { Clock, CheckCircle } from "lucide-react";

export default JournalManagement;
