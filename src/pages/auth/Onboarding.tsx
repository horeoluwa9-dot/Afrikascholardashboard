import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import afrikaLogo from "@/assets/afrika-scholar-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles, BookOpen, Users, Globe,
  Building2, Compass, GraduationCap, FlaskConical, FileText, Briefcase,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, AccountType } from "@/contexts/AuthContext";
import { toast } from "sonner";

const titleOptions = ["Dr", "Prof", "Mr", "Mrs", "Ms"];

const expertiseOptions = [
  "Public Health", "Computer Science", "Engineering", "Education", "Economics",
  "Agriculture", "Climate Science", "Social Sciences", "Law & Policy",
  "Arts & Humanities", "Business", "Medicine",
];

const accountTypeMeta: Record<AccountType, { icon: any; label: string }> = {
  researcher: { icon: FlaskConical, label: "Researcher / Academic" },
  lecturer: { icon: GraduationCap, label: "Lecturer / Professional" },
  institution: { icon: Building2, label: "Institution / Organization" },
  advisory_client: { icon: Compass, label: "Advisory Client" },
};

const featureMap: Record<AccountType, { icon: any; title: string; desc: string; link: string }[]> = {
  researcher: [
    { icon: Sparkles, title: "Generate research papers with AI", desc: "Quick or advanced workflows.", link: "/dashboard/generate-paper" },
    { icon: FileText, title: "Submit & track manuscripts", desc: "Submit to journals and track every stage.", link: "/dashboard/publishing/submit" },
    { icon: BookOpen, title: "Build your library", desc: "Save articles, track reading, manage subscriptions.", link: "/dashboard/library" },
    { icon: Users, title: "Connect with researchers", desc: "Find collaborators across Africa.", link: "/dashboard/community" },
  ],
  lecturer: [
    { icon: Briefcase, title: "Earn through engagements", desc: "Find teaching, research and review gigs.", link: "/dashboard/network/opportunities" },
    { icon: Users, title: "Build your network profile", desc: "Showcase your expertise to institutions.", link: "/dashboard/network" },
    { icon: BookOpen, title: "Access the library", desc: "Saved articles, journals and downloads.", link: "/dashboard/library" },
    { icon: GraduationCap, title: "Apply for academic roles", desc: "Track applications and contracts.", link: "/dashboard/network/applications" },
  ],
  institution: [
    { icon: Building2, title: "Request services", desc: "Lecturers, research, advisory, curriculum.", link: "/dashboard/institutional" },
    { icon: Users, title: "Browse verified academics", desc: "Hire from a vetted talent pool.", link: "/dashboard/institutional/lecturer-requests" },
    { icon: FileText, title: "Manage contracts", desc: "Active engagements and payments.", link: "/dashboard/institutional/contracts" },
    { icon: Sparkles, title: "Publishing & research", desc: "Publish institutional research output.", link: "/dashboard/publishing" },
  ],
  advisory_client: [
    { icon: Compass, title: "Open advisory cases", desc: "Transcripts, degree guidance, study in Africa.", link: "/dashboard/advisory" },
    { icon: FileText, title: "Upload your documents", desc: "Securely share files with your advisor.", link: "/dashboard/advisory/documents" },
    { icon: BookOpen, title: "Explore programs", desc: "Browse academic pathways across Africa.", link: "/dashboard/advisory/pathways" },
    { icon: Users, title: "Talk to your advisor", desc: "Direct messaging on every case.", link: "/dashboard/messages" },
  ],
};

const moduleMap: Record<AccountType, string[]> = {
  researcher: ["My Research", "Publishing", "Library", "Community", "Network"],
  lecturer: ["Network", "Library", "Community", "Publishing"],
  institution: ["Institutions", "Publishing", "Library", "Community"],
  advisory_client: ["Academic Advisory", "Library", "Community"],
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const accountType: AccountType = (profile?.account_type as AccountType) || "researcher";
  const totalSteps = 4;

  // Step 1 — common profile
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [institution, setInstitution] = useState(profile?.institution || "");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [discipline, setDiscipline] = useState(profile?.discipline || "");
  const [country, setCountry] = useState(profile?.country || "");

  // Step 2 — researcher / academic
  const [orcid, setOrcid] = useState("");
  const [scholar, setScholar] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [wantsPeerReview, setWantsPeerReview] = useState(false);
  const [wantsPublishing, setWantsPublishing] = useState(true);

  // Step 2 — lecturer
  const [qualifications, setQualifications] = useState("");
  const [yearsExp, setYearsExp] = useState("");
  const [rate, setRate] = useState("");
  const [wantsNetwork, setWantsNetwork] = useState(true);

  // Step 2 — institution
  const [orgType, setOrgType] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgSize, setOrgSize] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [contactName, setContactName] = useState("");

  // Step 2 — advisory client
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [countryQual, setCountryQual] = useState("");
  const [targetCountry, setTargetCountry] = useState("");

  useEffect(() => {
    if (profile) {
      setInstitution(profile.institution || "");
      setDiscipline(profile.discipline || "");
      setCountry(profile.country || "");
    }
  }, [profile]);

  const toggleExpertise = (v: string) =>
    setExpertise((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  const toggleService = (v: string) =>
    setServices((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const handleStep1Continue = async () => {
    if (!user) { setStep(2); return; }
    await supabase.from("profiles").update({
      academic_title: title || null,
      bio: bio || null,
      institution: institution || null,
      discipline: [discipline, ...expertise].filter(Boolean).join(", ") || null,
      country: country || null,
    }).eq("user_id", user.id);
    setStep(2);
  };

  const handleStep2Continue = async () => {
    if (!user) { setStep(3); return; }
    const updates: Record<string, any> = {};
    if (accountType === "researcher") {
      updates.orcid_id = orcid || null;
      updates.google_scholar_url = scholar || null;
      updates.linkedin_url = linkedin || null;
      updates.wants_peer_review = wantsPeerReview;
      updates.wants_publishing = wantsPublishing;
    } else if (accountType === "lecturer") {
      updates.academic_qualifications = qualifications || null;
      updates.years_of_experience = yearsExp || null;
      updates.rate_per_engagement = rate || null;
      updates.wants_academic_network = wantsNetwork;
    } else if (accountType === "institution") {
      updates.organisation_type = orgType || null;
      updates.organisation_website = orgWebsite || null;
      updates.organisation_size = orgSize || null;
      updates.primary_services_needed = services;
      updates.primary_contact_name = contactName || null;
    } else if (accountType === "advisory_client") {
      updates.advisory_services_needed = serviceNeeded || null;
      updates.country_of_qualification = countryQual || null;
      updates.target_country = targetCountry || null;
    }
    if (Object.keys(updates).length) await supabase.from("profiles").update(updates).eq("user_id", user.id);
    setStep(3);
  };

  const handleFinish = async () => {
    if (user) {
      await supabase.from("profiles").update({ onboarding_completed: true }).eq("user_id", user.id);
      await refreshProfile();
    }
    toast.success("Welcome to Afrika Scholar!");
    navigate("/dashboard");
  };

  const Meta = accountTypeMeta[accountType];
  const features = featureMap[accountType];
  const modules = moduleMap[accountType];

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-[640px]">
        <div className="text-center mb-6">
          <img src={afrikaLogo} alt="Afrika Scholar" className="h-9 mx-auto" />
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1.5 w-16 rounded-full transition-colors ${i + 1 <= step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
          {profile?.account_type && (
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-primary/5 text-xs text-primary">
              <Meta.icon className="h-3 w-3" /> {Meta.label}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-md transition-all">
          {/* STEP 1 — Profile */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">Set up your profile</h2>
                <p className="text-sm text-muted-foreground mt-1">Tell us a bit about you to personalize your dashboard.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Select value={title} onValueChange={setTitle}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select title" /></SelectTrigger>
                    <SelectContent>{titleOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Country</Label>
                  <Input className="mt-1" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Nigeria" />
                </div>
              </div>
              <div>
                <Label>Bio / About <span className="text-muted-foreground">(optional)</span></Label>
                <Textarea className="mt-1" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short introduction" />
              </div>
              <div>
                <Label>Institution / University / Company</Label>
                <Input className="mt-1" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. University of Lagos" />
              </div>
              {(accountType === "researcher" || accountType === "lecturer") ? (
                <div>
                  <Label>Areas of expertise</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {expertiseOptions.map((d) => (
                      <button key={d} type="button" onClick={() => toggleExpertise(d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          expertise.includes(d) ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"
                        }`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <Label>Area of interest / focus</Label>
                  <Input className="mt-1" value={discipline} onChange={(e) => setDiscipline(e.target.value)} placeholder="e.g. Public Health" />
                </div>
              )}
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleStep1Continue}>
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* STEP 2 — Role-specific */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">A bit more about your work</h2>
                <p className="text-sm text-muted-foreground mt-1">We'll use this to activate the right modules.</p>
              </div>

              {accountType === "researcher" && (
                <div className="space-y-4">
                  <div><Label>ORCID ID <span className="text-muted-foreground">(optional)</span></Label><Input className="mt-1" value={orcid} onChange={(e) => setOrcid(e.target.value)} placeholder="0000-0000-0000-0000" /></div>
                  <div><Label>Google Scholar URL <span className="text-muted-foreground">(optional)</span></Label><Input className="mt-1" value={scholar} onChange={(e) => setScholar(e.target.value)} placeholder="https://scholar.google.com/..." /></div>
                  <div><Label>LinkedIn URL <span className="text-muted-foreground">(optional)</span></Label><Input className="mt-1" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." /></div>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div><p className="text-sm font-semibold text-foreground">Join the peer review network</p><p className="text-xs text-muted-foreground">Get matched as a reviewer for journals.</p></div>
                    <Switch checked={wantsPeerReview} onCheckedChange={setWantsPeerReview} />
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div><p className="text-sm font-semibold text-foreground">I plan to publish research</p><p className="text-xs text-muted-foreground">Activates the Publishing module.</p></div>
                    <Switch checked={wantsPublishing} onCheckedChange={setWantsPublishing} />
                  </label>
                </div>
              )}

              {accountType === "lecturer" && (
                <div className="space-y-4">
                  <div>
                    <Label>Academic qualifications</Label>
                    <Select value={qualifications} onValueChange={setQualifications}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["BSc", "MSc", "PhD", "Other"].map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Years of experience</Label>
                    <Select value={yearsExp} onValueChange={setYearsExp}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["0-2", "3-5", "6-10", "11-15", "16+"].map(q => <SelectItem key={q} value={q}>{q} years</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Rate per engagement <span className="text-muted-foreground">(optional)</span></Label><Input className="mt-1" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. ₦150,000 / week" /></div>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div><p className="text-sm font-semibold text-foreground">Join the academic network</p><p className="text-xs text-muted-foreground">Required to receive engagement requests.</p></div>
                    <Switch checked={wantsNetwork} onCheckedChange={setWantsNetwork} />
                  </label>
                </div>
              )}

              {accountType === "institution" && (
                <div className="space-y-4">
                  <div>
                    <Label>Organisation type</Label>
                    <Select value={orgType} onValueChange={setOrgType}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["University", "EdTech", "NGO", "Government", "Private Company"].map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Organisation website</Label><Input className="mt-1" value={orgWebsite} onChange={(e) => setOrgWebsite(e.target.value)} placeholder="https://..." /></div>
                  <div>
                    <Label>Number of employees</Label>
                    <Select value={orgSize} onValueChange={setOrgSize}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Primary services needed</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {["Lecturers", "Research", "Advisory", "Curriculum"].map((s) => (
                        <label key={s} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-secondary">
                          <Checkbox checked={services.includes(s)} onCheckedChange={() => toggleService(s)} />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div><Label>Primary contact name</Label><Input className="mt-1" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full name" /></div>
                </div>
              )}

              {accountType === "advisory_client" && (
                <div className="space-y-4">
                  <div>
                    <Label>Service needed</Label>
                    <Select value={serviceNeeded} onValueChange={setServiceNeeded}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transcripts">Transcript Processing</SelectItem>
                        <SelectItem value="degree">Degree Guidance</SelectItem>
                        <SelectItem value="study">Study in Africa</SelectItem>
                        <SelectItem value="all">All of the above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Country of qualification</Label><Input className="mt-1" value={countryQual} onChange={(e) => setCountryQual(e.target.value)} placeholder="e.g. Nigeria" /></div>
                  <div><Label>Target country for study or verification</Label><Input className="mt-1" value={targetCountry} onChange={(e) => setTargetCountry(e.target.value)} placeholder="e.g. South Africa" /></div>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleStep2Continue}>
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 — Discover features */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-foreground">Here's what you can do</h2>
                <p className="text-sm text-muted-foreground mt-1">Based on your account type — explore now or skip.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f) => (
                  <div key={f.title} className="p-4 rounded-xl border border-border hover:border-primary/40 hover:shadow-sm transition-all">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
                <Button variant="ghost" onClick={() => setStep(4)}>Skip</Button>
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setStep(4)}>
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4 — Activation */}
          {step === 4 && (
            <div className="space-y-5 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mx-auto">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Your dashboard is ready</h2>
                <p className="text-sm text-muted-foreground mt-1">We've activated everything you need to get started.</p>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-left">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Activated modules</p>
                <ul className="space-y-1.5">
                  {modules.map((m) => (
                    <li key={m} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {m}
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="w-full h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleFinish}>
                Go to Dashboard <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
