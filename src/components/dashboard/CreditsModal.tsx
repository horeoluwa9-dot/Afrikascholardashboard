import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Database, BarChart3, HelpCircle } from "lucide-react";

const creditTypes = [
  {
    icon: FileText,
    title: "Paper Generation",
    desc: "1 Paper Credit per generation. Creates structured academic manuscripts with citations, methodology, and full sections.",
    color: "text-afrika-orange",
  },
  {
    icon: Database,
    title: "Dataset Generation",
    desc: "1 Dataset Credit per generation. Produces structured academic datasets with configurable variables and sample sizes.",
    color: "text-primary",
  },
  {
    icon: BarChart3,
    title: "Analysis Run",
    desc: "1 Analysis Credit per run. Performs statistical analysis including descriptive stats, correlation, regression, ANOVA, and more.",
    color: "text-afrika-green",
  },
];

export function CreditsHowItWorksModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <HelpCircle className="h-3 w-3" /> How credits work
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How Credits Work</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {creditTypes.map((c) => (
            <div key={c.title} className="flex gap-3 items-start">
              <c.icon className={`h-5 w-5 mt-0.5 ${c.color}`} />
              <div>
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            Credits reset monthly based on your plan. Additional credits can be purchased as add-ons.
          </p>
          <Link to="/publeesh/pricing">
            <Button variant="afrikaOutline" size="sm" className="w-full">
              Compare Plans
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function NoCreditModal({ type }: { type: "Paper" | "Dataset" | "Analysis" }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span />
      </DialogTrigger>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle>No {type} Credits Remaining</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          You've reached your monthly {type.toLowerCase()} credit limit. Upgrade your plan or purchase a credit pack.
        </p>
        <div className="flex gap-3 mt-4 justify-center">
          <Link to="/publeesh/pricing">
            <Button variant="afrika" size="sm">Upgrade Plan</Button>
          </Link>
          <Link to="/publeesh/pricing">
            <Button variant="afrikaOutline" size="sm">Buy Credit Pack</Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
