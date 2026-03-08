import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <div className="h-16 w-16 rounded-full bg-afrika-green/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-afrika-green" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Subscription Activated</h1>
        <p className="text-sm text-muted-foreground">
          Your Publeesh subscription is now active.<br />
          You now have access to AI-powered research tools.
        </p>
        <div className="flex gap-3 justify-center pt-4">
          <Link to="/dashboard">
            <Button variant="afrika" className="gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/dashboard/intelligence">
            <Button variant="afrikaOutline" className="gap-2">
              <Sparkles className="h-4 w-4" /> Explore Research Intelligence
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
