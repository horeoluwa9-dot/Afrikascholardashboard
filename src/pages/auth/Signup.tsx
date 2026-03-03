import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    referralCode: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const pw = form.password;
  const checks = {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    number: /\d/.test(pw),
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const autoFill = () => {
    setForm({
      fullName: "SOT GH",
      email: "horexoluwa9@gmail.com",
      password: "Demo1234",
      confirmPassword: "Demo1234",
      role: "student",
      referralCode: "",
    });
    setAgreed(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/auth/verify-email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-afrika-orange">Afrika</span>
            <span className="text-primary">scholar</span>
          </Link>
          <h1 className="text-xl font-bold text-primary mt-4">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join Afrika Scholar today</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-4">
          <div className="p-3 bg-afrika-orange-light rounded-lg text-center">
            <button type="button" onClick={autoFill} className="text-xs text-afrika-orange font-semibold hover:underline">
              Auto-fill demo data for testing
            </button>
          </div>

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
              {[
                { label: "At least 8 characters", ok: checks.length },
                { label: "Contains uppercase", ok: checks.uppercase },
                { label: "Contains number", ok: checks.number },
              ].map((c) => (
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

          <div>
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => handleChange("role", v)}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select your role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="academic">Academic / Lecturer</SelectItem>
                <SelectItem value="researcher">Researcher</SelectItem>
                <SelectItem value="institution">Institution</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="referral">Referral Code (Optional)</Label>
            <Input id="referral" value={form.referralCode} onChange={(e) => handleChange("referralCode", e.target.value)} placeholder="Enter code" className="mt-1" />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} id="terms" className="mt-0.5" />
            <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
              I agree to the{" "}
              <Link to="/terms" className="text-afrika-orange hover:underline">Terms of Service</Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-afrika-orange hover:underline">Privacy Policy</Link>
            </label>
          </div>

          <Button variant="afrika" className="w-full" type="submit" disabled={!agreed}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-afrika-orange font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
