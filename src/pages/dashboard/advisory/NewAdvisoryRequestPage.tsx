import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdvisoryCases, AdvisoryType, TYPE_LABEL } from "@/hooks/useAdvisoryCases";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, GraduationCap, Globe, Building2 } from "lucide-react";
import { useModuleUnlocks } from "@/hooks/useModuleUnlocks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TYPES: { v: AdvisoryType; label: string; desc: string; icon: any }[] = [
  { v: "transcript", label: "Transcript Advisory", desc: "Guidance on obtaining academic transcripts", icon: FileText },
  { v: "degree", label: "Degree Programs", desc: "Part-time, Master's, or Doctoral pathway support", icon: GraduationCap },
  { v: "study", label: "Study in Africa", desc: "Academic mobility and study abroad guidance", icon: Globe },
  { v: "institutional", label: "Institutional Liaison", desc: "Formal engagement with academic institutions", icon: Building2 },
];

const STEPS = ["Personal Info", "Advisory Type", "Details", "Review"];

export default function NewAdvisoryRequestPage() {
  const navigate = useNavigate();
  const { createCase } = useAdvisoryCases();
  const { unlockModule } = useModuleUnlocks();
  const [step, setStep] = useState(0);
  const [type, setType] = useState<AdvisoryType | "">("");
  const [agree, setAgree] = useState(false);

  // Personal
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Common details
  const [urgency, setUrgency] = useState("low");
  const [notes, setNotes] = useState("");

  // Transcript fields
  const [university, setUniversity] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [purpose, setPurpose] = useState("");

  // Degree fields
  const [degreeType, setDegreeType] = useState("");
  const [field, setField] = useState("");
  const [preferredInst, setPreferredInst] = useState("");

  // Study/Mobility
  const [currentCountry, setCurrentCountry] = useState("");
  const [destCountry, setDestCountry] = useState("");
  const [mobilityPurpose, setMobilityPurpose] = useState("");

  const canNext = () => {
    if (step === 0) return fullName && email;
    if (step === 1) return !!type;
    if (step === 2) {
      if (type === "transcript") return university && gradYear;
      if (type === "degree") return degreeType && field;
      if (type === "study") return currentCountry && destCountry;
      return true;
    }
    return agree;
  };

  const submit = () => {
    if (!type) return;
    const baseTitle =
      type === "transcript" ? `Transcript request — ${university}` :
      type === "degree" ? `Degree advisory — ${field}` :
      type === "study" ? `Study mobility — ${destCountry}` :
      "Institutional advisory request";
    const fields: Record<string, string> = {
      "Full Name": fullName, Email: email, Phone: phone, Urgency: urgency,
    };
    if (type === "transcript") Object.assign(fields, { University: university, "Year of Graduation": gradYear, Purpose: purpose });
    if (type === "degree") Object.assign(fields, { "Degree Type": degreeType, "Field of Study": field, "Preferred Institutions": preferredInst });
    if (type === "study") Object.assign(fields, { "Current Country": currentCountry, "Destination Country": destCountry, "Purpose of Mobility": mobilityPurpose });
    if (notes) fields["Additional Notes"] = notes;

    const c = createCase({ type, title: baseTitle, description: notes || baseTitle, fields });
    unlockModule("advisory");
    toast.success(`Request submitted. Case ID: ${c.id}`);
    navigate(`/dashboard/advisory/cases/${c.id}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero */}
        <div className="bg-primary text-primary-foreground rounded-xl px-8 py-10 text-center">
          <h1 className="text-3xl font-bold">Request Advisory Support</h1>
          <p className="text-sm opacity-90 mt-2">
            Tell us about your needs and we'll provide personalized guidance for your academic journey.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between gap-2 px-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold",
                  i < step && "bg-orange-500 text-white",
                  i === step && "bg-orange-500 text-white",
                  i > step && "bg-secondary text-muted-foreground"
                )}>
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn("text-sm whitespace-nowrap", i <= step ? "text-foreground font-medium" : "text-muted-foreground")}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-px mx-3", i < step ? "bg-orange-500" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="p-6 space-y-5">
            {step === 0 && (
              <>
                <div>
                  <h2 className="text-xl font-bold">Personal Information</h2>
                  <p className="text-sm text-muted-foreground mt-1">Tell us a bit about yourself.</p>
                </div>
                <Field label="Full Name *"><Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" /></Field>
                <Field label="Email *"><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
                <Field label="Phone"><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+234 ..." /></Field>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <h2 className="text-xl font-bold">Select Advisory Type</h2>
                  <p className="text-sm text-muted-foreground mt-1">Choose the type of advisory support you need.</p>
                </div>
                <RadioGroup value={type} onValueChange={(v) => setType(v as AdvisoryType)} className="space-y-3">
                  {TYPES.map(t => (
                    <label key={t.v} htmlFor={t.v} className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                      type === t.v ? "border-orange-500 bg-orange-50/50" : "border-border hover:border-primary/50"
                    )}>
                      <RadioGroupItem value={t.v} id={t.v} className="mt-0.5" />
                      <div>
                        <p className="font-semibold text-foreground">{t.label}</p>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <h2 className="text-xl font-bold">{type === "transcript" ? "Transcript Details" : type === "degree" ? "Degree Program Details" : type === "study" ? "Mobility Details" : "Institutional Details"}</h2>
                  <p className="text-sm text-muted-foreground mt-1">Provide specific details about your request.</p>
                </div>

                {type === "transcript" && <>
                  <Field label="University *">
                    <Select value={university} onValueChange={setUniversity}>
                      <SelectTrigger><SelectValue placeholder="Select your university" /></SelectTrigger>
                      <SelectContent>
                        {["University of Ibadan", "University of Lagos", "University of Nairobi", "University of Cape Town", "Makerere University", "Other"].map(u =>
                          <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Year of Graduation"><Input value={gradYear} onChange={e => setGradYear(e.target.value)} placeholder="e.g., 2020" /></Field>
                  <Field label="Purpose of Transcript Request">
                    <Select value={purpose} onValueChange={setPurpose}>
                      <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                      <SelectContent>
                        {["Employment", "Further Study", "Professional Licence", "Other"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </>}

                {type === "degree" && <>
                  <Field label="Type of Degree Program">
                    <Select value={degreeType} onValueChange={setDegreeType}>
                      <SelectTrigger><SelectValue placeholder="Select degree type" /></SelectTrigger>
                      <SelectContent>
                        {["Part-time", "Master's", "Doctoral / PhD", "Professional Diploma"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Field of Study"><Input value={field} onChange={e => setField(e.target.value)} placeholder="e.g., Business Administration, Computer Science" /></Field>
                  <Field label="Preferred Institutions (if any)"><Textarea value={preferredInst} onChange={e => setPreferredInst(e.target.value)} placeholder="List any universities you're interested in..." /></Field>
                </>}

                {type === "study" && <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Current Country"><Input value={currentCountry} onChange={e => setCurrentCountry(e.target.value)} placeholder="e.g., Nigeria" /></Field>
                    <Field label="Destination Country"><Input value={destCountry} onChange={e => setDestCountry(e.target.value)} placeholder="e.g., South Africa, Ghana" /></Field>
                  </div>
                  <Field label="Purpose of Mobility">
                    <Select value={mobilityPurpose} onValueChange={setMobilityPurpose}>
                      <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                      <SelectContent>
                        {["Undergraduate study", "Postgraduate study", "Research exchange", "Conference"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </>}

                <Field label="Additional Information"><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any other details that would help us assist you better..." /></Field>

                <div>
                  <p className="text-sm font-medium mb-2">Urgency Level</p>
                  <RadioGroup value={urgency} onValueChange={setUrgency} className="flex gap-6">
                    {[{ v: "low", l: "Low (Within 2 weeks)" }, { v: "medium", l: "Medium (Within 1 week)" }, { v: "high", l: "High (Urgent)" }].map(o =>
                      <label key={o.v} className="flex items-center gap-2 text-sm cursor-pointer">
                        <RadioGroupItem value={o.v} id={`u-${o.v}`} /> {o.l}
                      </label>
                    )}
                  </RadioGroup>
                </div>
              </>
            )}

            {step === 3 && type && (
              <>
                <div>
                  <h2 className="text-xl font-bold">Review & Submit</h2>
                  <p className="text-sm text-muted-foreground mt-1">Confirm your details before submitting.</p>
                </div>
                <div className="space-y-3">
                  <ReviewRow k="Service" v={TYPE_LABEL[type]} />
                  <ReviewRow k="Name" v={fullName} />
                  <ReviewRow k="Email" v={email} />
                  {phone && <ReviewRow k="Phone" v={phone} />}
                  {university && <ReviewRow k="University" v={university} />}
                  {gradYear && <ReviewRow k="Graduation Year" v={gradYear} />}
                  {purpose && <ReviewRow k="Purpose" v={purpose} />}
                  {degreeType && <ReviewRow k="Degree Type" v={degreeType} />}
                  {field && <ReviewRow k="Field" v={field} />}
                  {currentCountry && <ReviewRow k="Current Country" v={currentCountry} />}
                  {destCountry && <ReviewRow k="Destination" v={destCountry} />}
                  {notes && <ReviewRow k="Notes" v={notes} />}
                  <ReviewRow k="Urgency" v={urgency} />
                </div>
                <label className="flex items-start gap-2 text-sm">
                  <Checkbox checked={agree} onCheckedChange={(c) => setAgree(!!c)} className="mt-0.5" />
                  <span>I agree to the terms and privacy policy.</span>
                </label>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="afrika" disabled={!canNext()} onClick={() => setStep(s => s + 1)} className="gap-2">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="afrika" disabled={!canNext()} onClick={submit} className="gap-2">
              Submit Request <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-sm">{label}</Label>{children}</div>;
}
function ReviewRow({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b border-border py-2 text-sm"><span className="text-muted-foreground">{k}</span><span className="font-medium text-right max-w-[60%]">{v}</span></div>;
}
