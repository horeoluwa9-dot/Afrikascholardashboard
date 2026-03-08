import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical, GraduationCap, Briefcase, CheckCircle2,
  Sparkles, BookOpen, Users, Globe, ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const identities = [
  {
    id: "researcher",
    icon: FlaskConical,
    label: "Researcher",
    desc: "Conduct research, publish papers, and collaborate academically.",
  },
  {
    id: "academic",
    icon: GraduationCap,
    label: "Academic / Lecturer",
    desc: "Teach, supervise research, and participate in scholarly publishing.",
  },
  {
    id: "professional",
    icon: Briefcase,
    label: "Professional",
    desc: "Apply research knowledge within industry, policy, or professional environments.",
  },
];

const disciplineOptions = [
  "Social Sciences", "Health Sciences", "Engineering", "Arts & Humanities",
  "Law & Policy", "Agriculture", "Business & Economics", "Education",
  "Computer Science", "Environmental Science",
];

const welcomeFeatures = [
  {
    icon: Sparkles,
    title: "Use Publeesh AI",
    desc: "Generate research papers, analyze datasets, and get AI-powered insights.",
    link: "/dashboard/generate-paper",
  },
  {
    icon: BookOpen,
    title: "Publish Research",
    desc: "Submit manuscripts, track submissions, and discover journals.",
    link: "/dashboard/publishing/submit",
  },
  {
    icon: Users,
    title: "Join Academic Network",
    desc: "Connect with researchers, find collaborators, and explore opportunities.",
    link: "/dashboard/network",
  },
  {
    icon: Globe,
    title: "Explore Publications",
    desc: "Browse research papers, datasets, and academic resources across Africa.",
    link: "/dashboard/library",
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState("");
  const [country, setCountry] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [disciplines, setDisciplines] = useState<string[]>([]);

  const toggleDiscipline = (d: string) => {
    setDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const handleStep1Continue = async () => {
    if (user) {
      await supabase.from("profiles").update({
        institution: institution || null,
        discipline: [fieldOfStudy, ...disciplines].filter(Boolean).join(", ") || null,
      }).eq("user_id", user.id);
    }
    setStep(2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-2xl font-bold">
            <span className="text-afrika-orange">Afrika</span>
            <span className="text-primary">Scholar</span>
          </span>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-2 w-20 rounded-full transition-colors ${
                  s <= step ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Step {step} of 2</p>
        </div>

        {/* Step 1 — Profile Setup */}
        {step === 1 && (
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                Tell us about yourself
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Help us personalize your research experience.
              </p>
            </div>

            {/* Identity Cards */}
            <div>
              <Label className="text-sm font-semibold text-foreground mb-3 block">
                I am a
              </Label>
              <div className="space-y-3">
                {identities.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setIdentity(item.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      identity === item.id
                        ? "border-accent bg-[hsl(var(--afrika-orange-light))]"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                        identity === item.id
                          ? "bg-accent"
                          : "bg-secondary"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${
                          identity === item.id
                            ? "text-accent-foreground"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    {identity === item.id && (
                      <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="institution">Institution / Organization</Label>
                <Input
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. University of Lagos"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fieldOfStudy">Field of Study / Discipline</Label>
                <Input
                  id="fieldOfStudy"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                  placeholder="e.g. Public Health, Computer Science"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Nigeria"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Research Interests <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {disciplineOptions.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDiscipline(d)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        disciplines.includes(d)
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-muted"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              This information helps us recommend journals, collaborators, and research insights.
            </p>

            <Button
              variant="afrika"
              className="w-full"
              onClick={handleStep1Continue}
              disabled={!identity}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2 — Welcome Screen */}
        {step === 2 && (
          <div className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent/10 mb-4">
                <CheckCircle2 className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                You're ready to start exploring Afrika Scholar.
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                Discover research, publish papers, collaborate with scholars, and explore AI-powered research tools.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {welcomeFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl border border-border hover:border-accent/40 hover:shadow-sm transition-all group cursor-default"
                >
                  <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center mb-3">
                    <feature.icon className="h-4.5 w-4.5 text-accent" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {feature.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            <Badge variant="outline" className="w-full justify-center py-2 text-xs text-muted-foreground font-normal">
              Modules unlock automatically as you use the platform
            </Badge>

            <Button
              variant="afrika"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
