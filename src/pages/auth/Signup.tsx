import { useState } from "react";
import afrikaLogo from "@/assets/afrika-scholar-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ArrowLeft, ArrowRight, FlaskConical, GraduationCap, Building2, Compass, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import type { AccountType } from "@/contexts/AuthContext";

const accountTypes: { id: AccountType; icon: any; title: string; desc: string }[] = [
  { id: "researcher", icon: FlaskConical, title: "Researcher / Academic", desc: "I want to publish, review, or read research" },
  { id: "lecturer", icon: GraduationCap, title: "Lecturer / Professional", desc: "I want to join the academic network and earn" },
  { id: "institution", icon: Building2, title: "Institution / Organization", desc: "I want to hire academics or request services" },
  { id: "advisory_client", icon: Compass, title: "Advisory Client", desc: "I need transcript or degree guidance" },
];

const countries = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Egypt", "Ethiopia", "Morocco",
  "Tanzania", "Uganda", "Rwanda", "Senegal", "Côte d'Ivoire", "Cameroon",
  "Algeria", "Tunisia", "Zimbabwe", "Zambia", "Botswana", "Namibia", "Other",
];

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too short", "Weak", "Fair", "Strong", "Very strong", "Excellent"];
  const colors = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"];
  return { score, label: labels[Math.min(score, 5)], color: colors[Math.min(score, 5)] };
}

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
    country: "", organisationName: "",
  });
  const [agreeToS, setAgreeToS] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const strength = passwordStrength(form.password);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const handleGoogleSignIn = async () => {
    if (!accountType) { toast.error("Pick an account type first"); return; }
    sessionStorage.setItem("pending_account_type", accountType);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("Google sign-in failed");
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!emailValid) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.country) e.country = "Select your country";
    if (accountType === "institution" && !form.organisationName.trim()) e.organisationName = "Organisation name required";
    if (!agreeToS) e.agreeToS = "Required";
    if (!agreePrivacy) e.agreePrivacy = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/onboarding`,
        data: { display_name: form.fullName },
      },
    });
    if (error) { setLoading(false); toast.error(error.message); return; }

    // Persist account type + country immediately so onboarding picks them up
    if (data.user) {
      await supabase.from("profiles").update({
        account_type: accountType,
        country: form.country,
        institution: accountType === "institution" ? form.organisationName : null,
        display_name: form.fullName,
      }).eq("user_id", data.user.id);
    }
    setLoading(false);
    navigate(`/auth/verify-email?email=${encodeURIComponent(form.email)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-6">
          <Link to="/auth/login" className="inline-block">
            <img src={afrikaLogo} alt="Afrika Scholar" className="h-10 mx-auto" />
          </Link>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-md transition-all">
          {step === 1 ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-foreground">What brings you to Afrika Scholar?</h1>
                <p className="text-sm text-muted-foreground mt-1">Pick the option that best describes you.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {accountTypes.map((t) => {
                  const selected = accountType === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAccountType(t.id)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                        }`}>
                          <t.icon className="h-5 w-5" />
                        </div>
                        {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="text-sm font-semibold text-foreground mt-3">{t.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                    </button>
                  );
                })}
              </div>

              <Button className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90" disabled={!accountType} onClick={() => setStep(2)}>
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </>
          ) : (
            <>
              <button onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="h-3 w-3" /> Back to account type
              </button>
              <div className="text-center mb-5">
                <h1 className="text-xl font-bold text-foreground">Create your account</h1>
                <p className="text-sm text-muted-foreground mt-1">Selected: <span className="font-medium text-foreground">{accountTypes.find(t => t.id === accountType)?.title}</span></p>
              </div>

              <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn}>
                <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </Button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} placeholder="Your full name" className="mt-1" />
                  {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="you@example.com" className="mt-1" />
                  {form.email && !emailValid && <p className="text-xs text-destructive mt-1">Invalid email format</p>}
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input id="password" type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setField("password", e.target.value)} placeholder="At least 8 characters" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[0,1,2,3,4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded ${i < strength.score ? strength.color : "bg-muted"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{strength.label}</p>
                    </div>
                  )}
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Input id="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-destructive mt-1">Passwords don't match</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={form.country} onValueChange={(v) => setField("country", v)}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select your country" /></SelectTrigger>
                    <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
                </div>
                {accountType === "institution" && (
                  <div>
                    <Label htmlFor="organisationName">Organisation Name</Label>
                    <Input id="organisationName" value={form.organisationName} onChange={(e) => setField("organisationName", e.target.value)} placeholder="e.g. University of Lagos" className="mt-1" />
                    {errors.organisationName && <p className="text-xs text-destructive mt-1">{errors.organisationName}</p>}
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Checkbox checked={agreeToS} onCheckedChange={(v) => setAgreeToS(!!v)} className="mt-0.5" />
                    <span>I agree to the <a href="#" className="text-primary underline">Terms of Service</a></span>
                  </label>
                  <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                    <Checkbox checked={agreePrivacy} onCheckedChange={(v) => setAgreePrivacy(!!v)} className="mt-0.5" />
                    <span>I agree to the <a href="#" className="text-primary underline">Privacy Policy</a></span>
                  </label>
                </div>

                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/auth/login" className="text-primary font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
