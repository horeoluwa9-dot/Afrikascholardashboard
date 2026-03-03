import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2 } from "lucide-react";

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-afrika-orange">Afrika</span>
            <span className="text-primary">scholar</span>
          </Link>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm text-center space-y-5">
          <div className="h-16 w-16 rounded-full bg-afrika-orange-light mx-auto flex items-center justify-center">
            <Mail className="h-7 w-7 text-afrika-orange" />
          </div>
          <h2 className="text-xl font-bold text-primary">Check Your Email</h2>
          <p className="text-sm text-muted-foreground">
            We've sent a verification link to your email address. Click the link to verify your account.
          </p>

          <div className="space-y-2">
            <Button variant="afrikaOutline" className="w-full">Resend Verification Email</Button>
            <Link to="/auth/signup">
              <Button variant="ghost" className="w-full text-sm">Change Email Address</Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="afrika"
              className="w-full"
              onClick={() => {
                localStorage.setItem("verified", "true");
                navigate("/auth/onboarding");
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Simulate Verified (Testing)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
