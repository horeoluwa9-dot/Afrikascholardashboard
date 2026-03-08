import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, Sparkles } from "lucide-react";

interface PubleeshGateProps {
  children: ReactNode;
  hasSubscription?: boolean;
}

export function PubleeshGate({ children, hasSubscription = false }: PubleeshGateProps) {
  const [showModal, setShowModal] = useState(!hasSubscription);

  if (hasSubscription) return <>{children}</>;

  return (
    <>
      {children}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Publeesh AI Subscription Required
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Publeesh AI requires an active subscription to access AI-powered paper generation, literature exploration, dataset analysis, and citation building.
          </p>
          <div className="flex gap-2 mt-3">
            <Link to="/publeesh/pricing" className="flex-1">
              <Button variant="outline" className="w-full">View Plans</Button>
            </Link>
            <Link to="/publeesh/pricing" className="flex-1">
              <Button variant="afrika" className="w-full">Subscribe Now</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
