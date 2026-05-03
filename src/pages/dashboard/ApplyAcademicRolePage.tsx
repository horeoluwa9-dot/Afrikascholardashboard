import { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Shield, ArrowRight, Check, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePublishingRoles } from "@/hooks/usePublishingRoles";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";
import { toast } from "sonner";

type Role = "reviewer" | "editor";
type Step = "select" | "form" | "success";

export default function ApplyAcademicRolePage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialRole = (params.get("role") as Role) || null;
  const [step, setStep] = useState<Step>(initialRole ? "form" : "select");
  const [role, setRole] = useState<Role | null>(initialRole);

  const { profile, user } = useAuth();
  const { setReviewerStatus, setEditorStatus } = usePublishingRoles();
  const { unlockModule } = useModuleUnlocksContext();

  const [form, setForm] = useState({
    fullName: profile?.display_name || "",
    email: user?.email || "",
    discipline: "",
    expertise: "",
    qualification: "",
    institution: profile?.institution || "",
    years: "",
    orcid: "",
    scholar: "",
    linkedin: "",
    // reviewer-specific
    prevReviewExp: "",
    papersReviewed: "",
    preferredAreas: "",
    availability: "",
    // editor-specific
    editorialExp: "",
    journalsWorkedWith: "",
    editorialInterest: "",
    willManage: "",
  });

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!role) return;
    await unlockModule("publishing");
    if (role === "reviewer") setReviewerStatus("approved");
    else setEditorStatus("approved");
    setStep("success");
    toast.success("Application submitted — access temporarily enabled for testing.");
  };

  const targetLink = role === "editor" ? "/dashboard/publishing/journals" : "/dashboard/publishing/reviews";
  const targetLabel = role === "editor" ? "Open Editorial Workspace" : "Open Peer Review";

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => (step === "form" ? setStep("select") : navigate(-1))}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>

        {step === "select" && (
          <>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Apply for Academic Roles</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Contribute to the academic ecosystem as a Reviewer or Editor.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border hover:border-primary/40 transition-colors">
                <CardContent className="pt-6 pb-5 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Peer Reviewer</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review academic papers and contribute to scholarly quality.
                    </p>
                  </div>
                  <Button variant="afrika" size="sm" onClick={() => { setRole("reviewer"); setStep("form"); }}>
                    Apply as Reviewer
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-border hover:border-accent/40 transition-colors">
                <CardContent className="pt-6 pb-5 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Journal Editor</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage journal submissions and oversee publication decisions.
                    </p>
                  </div>
                  <Button variant="afrika" size="sm" onClick={() => { setRole("editor"); setStep("form"); }}>
                    Apply as Editor
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {step === "form" && role && (
          <>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {role === "reviewer" ? "Reviewer Application" : "Editor Application"}
                </h1>
                <Badge variant="secondary" className="text-[10px]">Step 2 of 3</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Tell us about your background. Your application will be reviewed by the Afrika Scholar team.
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Personal & Academic Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Full Name</Label><Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
                  <div className="space-y-1.5">
                    <Label>Academic Discipline</Label>
                    <Select value={form.discipline} onValueChange={(v) => set("discipline", v)}>
                      <SelectTrigger><SelectValue placeholder="Select discipline" /></SelectTrigger>
                      <SelectContent>
                        {["Health Sciences", "Engineering", "Economics", "Social Sciences", "Education", "Agriculture", "Environmental Studies", "Computer Science", "Humanities"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Highest Qualification</Label>
                    <Select value={form.qualification} onValueChange={(v) => set("qualification", v)}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["Bachelors", "Masters", "PhD", "Postdoc", "Professor"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Institution / Affiliation</Label><Input value={form.institution} onChange={(e) => set("institution", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Years of Experience</Label><Input type="number" min={0} value={form.years} onChange={(e) => set("years", e.target.value)} /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label>Areas of Expertise</Label><Input placeholder="e.g. Epidemiology, Climate Policy (comma separated)" value={form.expertise} onChange={(e) => set("expertise", e.target.value)} /></div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Linked Profiles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5"><Label>ORCID</Label><Input value={form.orcid} onChange={(e) => set("orcid", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Google Scholar</Label><Input value={form.scholar} onChange={(e) => set("scholar", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>LinkedIn (optional)</Label><Input value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} /></div>
                </div>
              </section>

              {role === "reviewer" ? (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Reviewing Background</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Previous Reviewing Experience</Label>
                      <Select value={form.prevReviewExp} onValueChange={(v) => set("prevReviewExp", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5"><Label>Number of papers reviewed (optional)</Label><Input type="number" min={0} value={form.papersReviewed} onChange={(e) => set("papersReviewed", e.target.value)} /></div>
                    <div className="space-y-1.5 sm:col-span-2"><Label>Preferred Review Areas</Label><Input placeholder="Comma separated" value={form.preferredAreas} onChange={(e) => set("preferredAreas", e.target.value)} /></div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Availability</Label>
                      <Select value={form.availability} onValueChange={(v) => set("availability", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="limited">Limited</SelectItem>
                          <SelectItem value="unavailable">Not available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Editorial Background</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Editorial Experience</Label>
                      <Select value={form.editorialExp} onValueChange={(v) => set("editorialExp", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5"><Label>Journals worked with</Label><Input value={form.journalsWorkedWith} onChange={(e) => set("journalsWorkedWith", e.target.value)} /></div>
                    <div className="space-y-1.5 sm:col-span-2"><Label>Areas of Editorial Interest</Label><Input value={form.editorialInterest} onChange={(e) => set("editorialInterest", e.target.value)} /></div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label>Willingness to manage submissions</Label>
                      <Select value={form.willManage} onValueChange={(v) => set("willManage", v)}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              )}

              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>CV (required)</Label><Input type="file" accept=".pdf,.doc,.docx" /></div>
                  <div className="space-y-1.5"><Label>Supporting documents (optional)</Label><Input type="file" multiple /></div>
                </div>
              </section>

              <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
                <p className="text-[11px] text-muted-foreground">Your application will be reviewed by the Afrika Scholar team.</p>
                <Button variant="afrika" onClick={submit}>Submit Application</Button>
              </div>
            </div>
          </>
        )}

        {step === "success" && role && (
          <div className="bg-card rounded-2xl border border-border p-8 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-afrika-green/10 text-afrika-green flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Application Submitted</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your application has been received and is currently under review.
              </p>
            </div>
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-xs text-foreground">
              For now, your access has been temporarily enabled while we complete internal testing.
              <div className="mt-1"><Badge variant="secondary" className="text-[10px]">Pending Verification</Badge></div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/dashboard"><Button variant="afrika" className="gap-1">Go to Dashboard</Button></Link>
              <Link to={targetLink}><Button variant="afrikaOutline" className="gap-1">{targetLabel} <ArrowRight className="h-3.5 w-3.5" /></Button></Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}