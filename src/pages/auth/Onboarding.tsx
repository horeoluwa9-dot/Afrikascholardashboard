import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Globe, Users, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const intents = [
  { id: "publeesh", icon: BookOpen, label: "Use Publeesh", desc: "AI-powered research intelligence" },
  { id: "publish", icon: Globe, label: "Publish Paper", desc: "Submit your manuscript for publication" },
  { id: "network", icon: Users, label: "Join Network", desc: "Connect with researchers across Africa" },
];

const disciplineOptions = [
  "Social Sciences", "Health Sciences", "Engineering", "Arts & Humanities",
  "Law & Policy", "Agriculture", "Business & Economics", "Education",
  "Computer Science", "Environmental Science",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState("");
  const [country, setCountry] = useState("");
  const [institution, setInstitution] = useState("");
  const [disciplines, setDisciplines] = useState<string[]>([]);

  const toggleDiscipline = (d: string) => {
    setDisciplines((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]);
  };

  const finish = async () => {
    if (user) {
      await supabase.from("profiles").update({
        institution,
        discipline: disciplines.join(", "),
      }).eq("user_id", user.id);
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <span className="text-2xl font-bold">
            <span className="text-afrika-orange">Afrika</span>
            <span className="text-primary">scholar</span>
          </span>
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-2 w-16 rounded-full transition-colors ${s <= step ? "bg-afrika-orange" : "bg-border"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Step {step} of 3</p>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary text-center">What brings you here?</h2>
              <div className="space-y-3">
                {intents.map((i) => (
                  <button key={i.id} onClick={() => setIntent(i.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${intent === i.id ? "border-afrika-orange bg-afrika-orange-light" : "border-border hover:border-muted-foreground"}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${intent === i.id ? "bg-afrika-orange" : "bg-secondary"}`}>
                      <i.icon className={`h-5 w-5 ${intent === i.id ? "text-accent-foreground" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{i.label}</p>
                      <p className="text-xs text-muted-foreground">{i.desc}</p>
                    </div>
                    {intent === i.id && <CheckCircle2 className="h-5 w-5 text-afrika-orange ml-auto" />}
                  </button>
                ))}
              </div>
              <Button variant="afrika" className="w-full" onClick={() => setStep(2)} disabled={!intent}>Continue</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary text-center">
                {intent === "publeesh" ? "Start Your Research Journey" : "Tell Us More"}
              </h2>
              {intent === "publeesh" && (
                <div className="p-4 bg-afrika-orange-light rounded-xl text-center">
                  <p className="text-sm font-semibold text-afrika-orange">🎉 Start with a free 3-day Pro trial</p>
                  <p className="text-xs text-muted-foreground mt-1">Or explore pricing for the right plan.</p>
                </div>
              )}
              <p className="text-sm text-muted-foreground text-center">We'll personalize your experience.</p>
              <Button variant="afrika" className="w-full" onClick={() => setStep(3)}>Continue</Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>Back</Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary text-center">Almost There!</h2>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Nigeria" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="institution">Institution (Optional)</Label>
                <Input id="institution" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. University of Lagos" className="mt-1" />
              </div>
              <div>
                <Label>Disciplines</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {disciplineOptions.map((d) => (
                    <button key={d} onClick={() => toggleDiscipline(d)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${disciplines.includes(d) ? "bg-afrika-orange text-accent-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="afrika" className="w-full" onClick={finish}>Continue to Dashboard</Button>
              <Button variant="ghost" className="w-full" onClick={() => setStep(2)}>Back</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
