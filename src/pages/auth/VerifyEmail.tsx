import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import afrikaLogo from "@/assets/afrika-scholar-logo.png";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) { toast.error("Missing email"); return; }
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) toast.error(error.message);
    else { toast.success("Verification email resent"); setCooldown(60); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-[480px]">
        <div className="text-center mb-6">
          <Link to="/auth/login" className="inline-block">
            <img src={afrikaLogo} alt="Afrika Scholar" className="h-10 mx-auto" />
          </Link>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-md text-center space-y-5">
          <div className="h-20 w-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Check Your Email</h2>
          <p className="text-sm text-muted-foreground">
            {email
              ? <>We sent a verification link to <strong className="text-foreground">{email}</strong></>
              : "We sent you a verification link. Click it to continue."}
          </p>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleResend} disabled={cooldown > 0}>
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Verification Email"}
            </Button>
            <Link to="/auth/signup">
              <Button variant="ghost" className="w-full text-sm">Change Email Address</Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/auth/onboarding")}
            >
              <CheckCircle2 className="h-4 w-4" />
              I've verified my email — Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
