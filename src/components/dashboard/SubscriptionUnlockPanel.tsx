import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, FileText, Database, BarChart3, Wrench, Compass } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const lockedTools = [
  { icon: FileText, title: "Generate Paper" },
  { icon: Database, title: "Explore Datasets" },
  { icon: BarChart3, title: "Analyze Data" },
  { icon: Wrench, title: "Build Instrument" },
  { icon: Compass, title: "Intelligence Insights" },
];

export function SubscriptionUnlockPanel() {
  return (
    <div className="space-y-6">
      {/* Unlock CTA Panel */}
      <div className="bg-card rounded-xl border border-border p-6 text-center space-y-3">
        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Unlock AI-Powered Research Intelligence</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Access Afrika Scholar's Publeesh AI tools for structured research drafting, literature enhancement, global datasets, and analytics.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link to="/publeesh/subscription">
            <Button variant="afrikaOutline">View Plans</Button>
          </Link>
          <Link to="/publeesh/subscription">
            <Button variant="afrika">Start Free Trial</Button>
          </Link>
        </div>
      </div>

      {/* Locked Tool Cards */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Research Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedTools.map((tool) => (
            <Tooltip key={tool.title}>
              <TooltipTrigger asChild>
                <Link
                  to="/publeesh/subscription"
                  className="bg-card rounded-xl p-5 border border-border flex items-center gap-4 opacity-60 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 relative">
                    <tool.icon className="h-5 w-5 text-muted-foreground" />
                    <Lock className="h-3 w-3 text-muted-foreground absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{tool.title}</p>
                    <p className="text-xs text-muted-foreground">Subscription required</p>
                  </div>
                  <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Subscribe to Publeesh to access this feature.</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/publeesh/subscription">
            <Button variant="afrikaOutline" size="sm">View Subscription Plans</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
