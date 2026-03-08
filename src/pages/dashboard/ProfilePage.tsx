import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  User, GraduationCap, Building2, BookOpen, Globe, MapPin, FileText,
  Plus, Trash2, Pencil, Users, MessageCircle, Eye, Lock, Check, X,
  Shield, ChevronRight, Handshake, ExternalLink, Download, Share2,
} from "lucide-react";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { useAcademicProfile, type AcademicCredential, type Publication } from "@/hooks/useAcademicProfile";

const roleLabels: Record<AppRole, string> = {
  researcher: "Researcher",
  student: "Student",
  reviewer: "Reviewer",
  institutional_admin: "Institutional Admin",
};

const ProfilePage = () => {
  const { user, role } = useAuth();
  const {
    profile, credentials, publications, interests, loading, isOwner, completeness,
    updateProfile, addCredential, deleteCredential, addPublication, deletePublication,
    addInterest, removeInterest,
  } = useAcademicProfile();

  // Edit dialogs
  const [editBio, setEditBio] = useState(false);
  const [editInstitution, setEditInstitution] = useState(false);
  const [addCredDialog, setAddCredDialog] = useState(false);
  const [addPubDialog, setAddPubDialog] = useState(false);
  const [addInterestDialog, setAddInterestDialog] = useState(false);
  const [editCollabDialog, setEditCollabDialog] = useState(false);
  const [editProfileDialog, setEditProfileDialog] = useState(false);
  const [editVisibilityDialog, setEditVisibilityDialog] = useState(false);

  // Form states
  const [bioText, setBioText] = useState("");
  const [instForm, setInstForm] = useState({ institution: "", department: "", position: "" });
  const [credForm, setCredForm] = useState({ degree: "", field_of_study: "", university: "", year_of_graduation: "" });
  const [pubForm, setPubForm] = useState({ title: "", journal: "", status: "published", year: "" });
  const [interestName, setInterestName] = useState("");
  const [collabForm, setCollabForm] = useState({ available: false, description: "" });
  const [profileForm, setProfileForm] = useState({ display_name: "", academic_title: "", country: "" });
  const [visibility, setVisibility] = useState("public");
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="h-48 bg-card rounded-xl border border-border animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-card rounded-xl border border-border animate-pulse" />)}
            </div>
            <div className="h-64 bg-card rounded-xl border border-border animate-pulse" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const displayName = profile?.display_name || "Researcher";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Academic Profile</span>
        </div>

        {/* ====== PROFILE HEADER ====== */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-primary/80 to-accent/40 px-6 pb-6 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-3xl font-bold border-4 border-card shadow-lg shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0 pt-2">
                <h1 className="text-2xl font-bold text-primary-foreground font-serif">{displayName}</h1>
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {profile?.academic_title && (
                    <Badge className="bg-accent/10 text-accent border-accent/30 text-xs">{profile.academic_title}</Badge>
                  )}
                  {role && (
                    <Badge variant="outline" className="text-xs capitalize">{roleLabels[role]}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                  {profile?.institution && (
                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{profile.institution}</span>
                  )}
                  {profile?.country && (
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{profile.country}</span>
                  )}
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-2 shrink-0 sm:self-center">
                  <Button variant="afrika" size="sm" className="gap-1.5"
                    onClick={() => {
                      setProfileForm({
                        display_name: profile?.display_name || "",
                        academic_title: profile?.academic_title || "",
                        country: profile?.country || "",
                      });
                      setEditProfileDialog(true);
                    }}>
                    <Pencil className="h-3 w-3" /> Edit Profile
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ====== MAIN CONTENT ====== */}
          <div className="lg:col-span-2 space-y-5">

            {/* BIO / SUMMARY */}
            <section className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-accent" /> Profile Summary
                </h2>
                {isOwner && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
                    setBioText(profile?.bio || "");
                    setEditBio(true);
                  }}>
                    <Pencil className="h-3 w-3" /> {profile?.bio ? "Edit" : "Add Bio"}
                  </Button>
                )}
              </div>
              {profile?.bio ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No academic bio added yet.</p>
              )}
            </section>

            {/* ACADEMIC CREDENTIALS */}
            <section className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-accent" /> Academic Credentials
                </h2>
                {isOwner && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
                    setCredForm({ degree: "", field_of_study: "", university: "", year_of_graduation: "" });
                    setAddCredDialog(true);
                  }}>
                    <Plus className="h-3 w-3" /> Add Credential
                  </Button>
                )}
              </div>
              {credentials.length > 0 ? (
                <div className="space-y-3">
                  {credentials.map(c => (
                    <div key={c.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{c.degree} — {c.field_of_study}</p>
                        <p className="text-xs text-muted-foreground">{c.university}</p>
                        {c.year_of_graduation && <p className="text-xs text-muted-foreground">{c.year_of_graduation}</p>}
                      </div>
                      {isOwner && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteCredential(c.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-border rounded-lg">
                  <GraduationCap className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No credentials added yet.</p>
                </div>
              )}
            </section>

            {/* INSTITUTION INFORMATION */}
            <section className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-accent" /> Institution
                </h2>
                {isOwner && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
                    setInstForm({
                      institution: profile?.institution || "",
                      department: profile?.department || "",
                      position: profile?.position || "",
                    });
                    setEditInstitution(true);
                  }}>
                    <Pencil className="h-3 w-3" /> {profile?.institution ? "Edit" : "Add Institution"}
                  </Button>
                )}
              </div>
              {profile?.institution ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground w-24 shrink-0">Institution:</span>
                    <span className="text-foreground font-medium">{profile.institution}</span>
                  </div>
                  {profile.department && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground w-24 shrink-0">Department:</span>
                      <span className="text-foreground">{profile.department}</span>
                    </div>
                  )}
                  {profile.position && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground w-24 shrink-0">Role:</span>
                      <span className="text-foreground">{profile.position}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Institution information not added yet.</p>
              )}
            </section>

            {/* RESEARCH INTERESTS */}
            <section className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-accent" /> Research Interests
                </h2>
                {isOwner && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
                    setInterestName("");
                    setAddInterestDialog(true);
                  }}>
                    <Plus className="h-3 w-3" /> Add Interest
                  </Button>
                )}
              </div>
              {interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {interests.map(i => (
                    <Badge key={i.id} variant="secondary" className="text-xs gap-1.5 px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors cursor-pointer">
                      {i.name}
                      {isOwner && (
                        <button onClick={(e) => { e.stopPropagation(); removeInterest(i.id); }}
                          className="ml-1 hover:text-destructive transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No research interests added.</p>
              )}
            </section>

            {/* PUBLICATIONS */}
            <section className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" /> Publications
                </h2>
                {isOwner && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
                    setPubForm({ title: "", journal: "", status: "published", year: "" });
                    setAddPubDialog(true);
                  }}>
                    <Plus className="h-3 w-3" /> Add Publication
                  </Button>
                )}
              </div>
              {publications.length > 0 ? (
                <div className="space-y-3">
                  {publications.map(p => (
                    <div key={p.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{p.title}</p>
                          {p.journal && <p className="text-xs text-muted-foreground mt-0.5">{p.journal}</p>}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={`text-[10px] ${p.status === "published" ? "bg-afrika-green/10 text-afrika-green border-afrika-green/30" : "bg-accent/10 text-accent border-accent/30"}`}>
                              {p.status === "published" ? "Published" : p.status === "under_review" ? "Under Review" : p.status}
                            </Badge>
                            {p.year && <span className="text-[10px] text-muted-foreground">{p.year}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Share2 className="h-3.5 w-3.5" /></Button>
                          {isOwner && (
                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive"
                              onClick={() => deletePublication(p.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-border rounded-lg">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">No publications available yet.</p>
                </div>
              )}
            </section>

            {/* ACADEMIC NETWORK */}
            <section className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-accent" /> Academic Network
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-xl font-bold text-foreground">0</p>
                  <p className="text-[10px] text-muted-foreground">Connections</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-xl font-bold text-foreground">0</p>
                  <p className="text-[10px] text-muted-foreground">Followers</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-xl font-bold text-foreground">0</p>
                  <p className="text-[10px] text-muted-foreground">Collaborations</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic">No network connections yet.</p>
              <Link to="/dashboard/network">
                <Button variant="outline" size="sm" className="mt-3 text-xs gap-1.5">
                  <Globe className="h-3 w-3" /> Explore Network
                </Button>
              </Link>
            </section>

            {/* COLLABORATION */}
            <section className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-accent" /> Collaboration Opportunities
                </h2>
                {isOwner && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
                    setCollabForm({
                      available: profile?.available_for_collaboration || false,
                      description: profile?.collaboration_description || "",
                    });
                    setEditCollabDialog(true);
                  }}>
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground">Available for collaboration:</span>
                <Badge variant={profile?.available_for_collaboration ? "default" : "outline"}
                  className={profile?.available_for_collaboration ? "bg-afrika-green text-accent-foreground" : ""}>
                  {profile?.available_for_collaboration ? "Yes" : "No"}
                </Badge>
              </div>
              {profile?.collaboration_description ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.collaboration_description}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No collaboration details added.</p>
              )}
              {!isOwner && (
                <div className="flex gap-2 mt-4">
                  <Button variant="afrika" size="sm" className="gap-1.5"><Handshake className="h-3.5 w-3.5" /> Request Collaboration</Button>
                  <Button variant="outline" size="sm" className="gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> Message Researcher</Button>
                </div>
              )}
            </section>
          </div>

          {/* ====== RIGHT SIDEBAR ====== */}
          <div className="space-y-5">
            {/* Profile Strength */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">Profile Strength</h3>
              <div className="flex items-center gap-3 mb-2">
                <Progress value={completeness} className="flex-1 h-2" />
                <span className="text-sm font-bold text-accent">{completeness}%</span>
              </div>
              <div className="space-y-2 mt-4">
                {[
                  { label: "Add bio", done: !!profile?.bio },
                  { label: "Add institution", done: !!profile?.institution },
                  { label: "Add country", done: !!profile?.country },
                  { label: "Add credentials", done: credentials.length > 0 },
                  { label: "Add publications", done: publications.length > 0 },
                  { label: "Add research interests", done: interests.length > 0 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-xs">
                    {item.done ? (
                      <Check className="h-3.5 w-3.5 text-afrika-green" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-border" />
                    )}
                    <span className={item.done ? "text-muted-foreground line-through" : "text-foreground"}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-3">
              <h3 className="text-sm font-bold text-foreground">Quick Info</h3>
              {profile?.institution && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{profile.institution}</span>
                </div>
              )}
              {profile?.department && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{profile.department}</span>
                </div>
              )}
              {profile?.country && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{profile.country}</span>
                </div>
              )}
              {profile?.discipline && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span>{profile.discipline}</span>
                </div>
              )}
            </div>

            {/* Privacy */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-accent" /> Privacy
                </h3>
                {isOwner && (
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => {
                    setVisibility(profile?.profile_visibility || "public");
                    setEditVisibilityDialog(true);
                  }}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {profile?.profile_visibility === "network" ? "Visible to Network" :
                 profile?.profile_visibility === "private" ? "Private" : "Public Profile"}
              </Badge>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-2">
              <h3 className="text-sm font-bold text-foreground">Quick Actions</h3>
              <Link to="/dashboard/settings">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs gap-1.5">
                  <Pencil className="h-3 w-3" /> Account Settings
                </Button>
              </Link>
              <Link to="/dashboard/network">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs gap-1.5">
                  <Globe className="h-3 w-3" /> Explore Network
                </Button>
              </Link>
              <Link to="/dashboard/community">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs gap-1.5">
                  <Users className="h-3 w-3" /> Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DIALOGS ===== */}

      {/* Edit Bio */}
      <Dialog open={editBio} onOpenChange={setEditBio}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Bio</DialogTitle></DialogHeader>
          <Textarea value={bioText} onChange={(e) => setBioText(e.target.value)} rows={5}
            placeholder="Tell others about your research focus and academic background..." />
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditBio(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={saving} onClick={async () => {
              setSaving(true);
              await updateProfile({ bio: bioText } as any);
              setSaving(false);
              setEditBio(false);
            }}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Institution */}
      <Dialog open={editInstitution} onOpenChange={setEditInstitution}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Institution Information</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Institution</Label><Input className="mt-1" value={instForm.institution} onChange={e => setInstForm(f => ({...f, institution: e.target.value}))} /></div>
            <div><Label>Department</Label><Input className="mt-1" value={instForm.department} onChange={e => setInstForm(f => ({...f, department: e.target.value}))} /></div>
            <div><Label>Position / Role</Label><Input className="mt-1" value={instForm.position} onChange={e => setInstForm(f => ({...f, position: e.target.value}))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditInstitution(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={saving} onClick={async () => {
              setSaving(true);
              await updateProfile({ institution: instForm.institution, department: instForm.department, position: instForm.position } as any);
              setSaving(false);
              setEditInstitution(false);
            }}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Credential */}
      <Dialog open={addCredDialog} onOpenChange={setAddCredDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Academic Credential</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Degree</Label><Input className="mt-1" placeholder="e.g. PhD, MSc, BSc" value={credForm.degree} onChange={e => setCredForm(f => ({...f, degree: e.target.value}))} /></div>
            <div><Label>Field of Study</Label><Input className="mt-1" placeholder="e.g. Public Health" value={credForm.field_of_study} onChange={e => setCredForm(f => ({...f, field_of_study: e.target.value}))} /></div>
            <div><Label>University</Label><Input className="mt-1" value={credForm.university} onChange={e => setCredForm(f => ({...f, university: e.target.value}))} /></div>
            <div><Label>Year of Graduation</Label><Input className="mt-1" type="number" value={credForm.year_of_graduation} onChange={e => setCredForm(f => ({...f, year_of_graduation: e.target.value}))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddCredDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={saving || !credForm.degree || !credForm.field_of_study || !credForm.university} onClick={async () => {
              setSaving(true);
              await addCredential({
                degree: credForm.degree,
                field_of_study: credForm.field_of_study,
                university: credForm.university,
                year_of_graduation: credForm.year_of_graduation ? parseInt(credForm.year_of_graduation) : null,
              });
              setSaving(false);
              setAddCredDialog(false);
            }}>{saving ? "Saving..." : "Add Credential"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Publication */}
      <Dialog open={addPubDialog} onOpenChange={setAddPubDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Publication</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input className="mt-1" value={pubForm.title} onChange={e => setPubForm(f => ({...f, title: e.target.value}))} /></div>
            <div><Label>Journal / Conference</Label><Input className="mt-1" value={pubForm.journal} onChange={e => setPubForm(f => ({...f, journal: e.target.value}))} /></div>
            <div>
              <Label>Status</Label>
              <Select value={pubForm.status} onValueChange={v => setPubForm(f => ({...f, status: v}))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Year</Label><Input className="mt-1" type="number" value={pubForm.year} onChange={e => setPubForm(f => ({...f, year: e.target.value}))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddPubDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={saving || !pubForm.title} onClick={async () => {
              setSaving(true);
              await addPublication({
                title: pubForm.title,
                journal: pubForm.journal || null,
                status: pubForm.status,
                year: pubForm.year ? parseInt(pubForm.year) : null,
                pdf_url: null,
              });
              setSaving(false);
              setAddPubDialog(false);
            }}>{saving ? "Saving..." : "Add Publication"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Interest */}
      <Dialog open={addInterestDialog} onOpenChange={setAddInterestDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Research Interest</DialogTitle></DialogHeader>
          <Input placeholder="e.g. Epidemiology, AI in Healthcare" value={interestName} onChange={e => setInterestName(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setAddInterestDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={!interestName.trim()} onClick={async () => {
              await addInterest(interestName.trim());
              setInterestName("");
              setAddInterestDialog(false);
            }}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Collaboration */}
      <Dialog open={editCollabDialog} onOpenChange={setEditCollabDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Collaboration Settings</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label>Available for collaboration</Label>
              <button onClick={() => setCollabForm(f => ({...f, available: !f.available}))}
                className={`h-5 w-9 rounded-full transition-colors ${collabForm.available ? "bg-accent" : "bg-border"} relative`}>
                <div className={`h-4 w-4 rounded-full bg-card absolute top-0.5 transition-transform ${collabForm.available ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea className="mt-1" rows={3} value={collabForm.description} onChange={e => setCollabForm(f => ({...f, description: e.target.value}))}
                placeholder="Describe what kind of collaborations you're interested in..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditCollabDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={saving} onClick={async () => {
              setSaving(true);
              await updateProfile({
                available_for_collaboration: collabForm.available,
                collaboration_description: collabForm.description,
              } as any);
              setSaving(false);
              setEditCollabDialog(false);
            }}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Header */}
      <Dialog open={editProfileDialog} onOpenChange={setEditProfileDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Full Name</Label><Input className="mt-1" value={profileForm.display_name} onChange={e => setProfileForm(f => ({...f, display_name: e.target.value}))} /></div>
            <div><Label>Academic Title</Label><Input className="mt-1" placeholder="e.g. Dr., Prof., Research Fellow" value={profileForm.academic_title} onChange={e => setProfileForm(f => ({...f, academic_title: e.target.value}))} /></div>
            <div><Label>Country</Label><Input className="mt-1" value={profileForm.country} onChange={e => setProfileForm(f => ({...f, country: e.target.value}))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditProfileDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={saving} onClick={async () => {
              setSaving(true);
              await updateProfile({
                display_name: profileForm.display_name,
                academic_title: profileForm.academic_title,
                country: profileForm.country,
              } as any);
              setSaving(false);
              setEditProfileDialog(false);
            }}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Settings */}
      <Dialog open={editVisibilityDialog} onOpenChange={setEditVisibilityDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Profile Visibility</DialogTitle></DialogHeader>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public Profile</SelectItem>
              <SelectItem value="network">Visible to Network</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditVisibilityDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={saving} onClick={async () => {
              setSaving(true);
              await updateProfile({ profile_visibility: visibility } as any);
              setSaving(false);
              setEditVisibilityDialog(false);
            }}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProfilePage;
