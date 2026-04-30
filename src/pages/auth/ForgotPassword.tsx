import { useState } from "react";
import { Link } from "react-router-dom";
import afrikaLogo from "@/assets/afrika-scholar-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else setSent(true);
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
            <h1 className="text-xl font-bold text-foreground">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <p className="text-sm text-foreground">We've sent a password reset link to <strong>{email}</strong></p>
              <p className="text-xs text-muted-foreground">Check your email and follow the instructions.</p>
              <Button variant="outline" onClick={() => setSent(false)} className="w-full">Try another email</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
        </div>

        <Link to="/auth/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground mt-6 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
