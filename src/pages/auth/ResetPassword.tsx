import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import afrikaLogo from "@/assets/afrika-scholar-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

function strength(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const labels = ["Too short", "Weak", "Fair", "Strong", "Very strong", "Excellent"];
  const colors = ["bg-destructive", "bg-destructive", "bg-amber-500", "bg-amber-500", "bg-emerald-500", "bg-emerald-600"];
  return { score: s, label: labels[Math.min(s, 5)], color: colors[Math.min(s, 5)] };
}

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const st = strength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Password updated successfully");
      setTimeout(() => navigate("/auth/login"), 1200);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-6">
          <Link to="/auth/login" className="inline-block">
            <img src={afrikaLogo} alt="Afrika Scholar" className="h-10 mx-auto" />
          </Link>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-md">
          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-foreground">Set New Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Choose a strong new password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="password">New Password</Label>
              <div className="relative mt-1">
                <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPw(!showPw)}>
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0,1,2,3,4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded ${i < st.score ? st.color : "bg-muted"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{st.label}</p>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="mt-1" />
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" type="submit" disabled={password !== confirm || password.length < 8 || loading}>
              {loading ? "Updating..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
