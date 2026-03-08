import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle2, XCircle, FlaskConical, GraduationCap, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const identityOptions = [
  {
    value: "researcher",
    label: "Researcher",
    description: "Conduct and publish research, analyze data, and collaborate on academic work.",
    icon: FlaskConical,
  },
  {
    value: "academic",
    label: "Academic / Lecturer",
    description: "Teach, supervise students, and participate in academic publishing and peer review.",
    icon: GraduationCap,
  },
  {
    value: "professional",
    label: "Professional",
    description: "Apply research and academic insights within industry, policy, or professional environments.",
    icon: Briefcase,
  },
];

const roleMap: Record<string, string> = {
  researcher: "researcher",
  academic: "researcher",
  professional: "researcher",
};

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirmPassword: "", identity: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const pw = form.password;
  const checks = { length: pw.length >= 8, uppercase: /[A-Z]/.test(pw), number: /\d/.test(pw) };
  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (error) toast({ title: "Google sign-in failed", description: String(error), variant: "destructive" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast({ title: "Passwords don't match", variant: "destructive" }); return; }
    if (!form.identity) { toast({ title: "Please select your identity", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: form.fullName, identity_type: form.identity, role: roleMap[form.identity] || "researcher" },
      },
    });
    setLoading(false);
    if (error) { toast({ title: "Signup failed", description: error.message, variant: "destructive" }); }
    else { navigate("/auth/verify-email"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-afrika-orange">Afrika</span><span className="text-primary">scholar</span>
          </Link>
          <h1 className="text-xl font-bold text-primary mt-4">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join Afrika Scholar today</p>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-4">
          <Button variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn}>
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} placeholder="Your full name" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@example.com" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPw ? "text" : "password"} value={form.password} onChange={(e) => handleChange("password", e.target.value)} placeholder="••••••••" required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 space-y-1">
                {[{ label: "At least 8 characters", ok: checks.length }, { label: "Contains uppercase", ok: checks.uppercase }, { label: "Contains number", ok: checks.number }].map((c) => (
                  <div key={c.label} className="flex items-center gap-1.5 text-xs">
                    {c.ok ? <CheckCircle2 className="h-3 w-3 text-afrika-green" /> : <XCircle className="h-3 w-3 text-muted-foreground" />}
                    <span className={c.ok ? "text-afrika-green" : "text-muted-foreground"}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <Input id="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} placeholder="••••••••" required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Identity Selection Cards */}
            <div className="space-y-2">
              <Label>I am a</Label>
              <div className="grid gap-2">
                {identityOptions.map((opt) => {
                  const selected = form.identity === opt.value;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleChange("identity", opt.value)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all",
                        selected
                          ? "border-afrika-orange bg-afrika-orange/5"
                          : "border-border bg-background hover:border-muted-foreground/30"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        selected ? "bg-afrika-orange text-white" : "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={cn("text-sm font-semibold", selected ? "text-afrika-orange" : "text-foreground")}>{opt.label}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This helps personalize your dashboard. Additional features unlock automatically as you use the platform.
              </p>
            </div>

            <Button variant="afrika" className="w-full" type="submit" disabled={!form.identity || loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/auth/login" className="text-afrika-orange font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
