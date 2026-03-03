import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-afrika-orange">Afrika</span>
            <span className="text-primary">scholar</span>
          </Link>
          <h1 className="text-xl font-bold text-primary mt-4">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-afrika-green mx-auto" />
              <p className="text-sm text-foreground">We've sent a password reset link to <strong>{email}</strong></p>
              <p className="text-xs text-muted-foreground">Check your email and follow the instructions.</p>
              <Button variant="afrikaOutline" onClick={() => setSent(false)} className="w-full">Try another email</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1" />
              </div>
              <Button variant="afrika" className="w-full" type="submit">Send Reset Link</Button>
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
