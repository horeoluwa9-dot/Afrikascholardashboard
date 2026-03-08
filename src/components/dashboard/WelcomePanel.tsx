import { Link } from "react-router-dom";
import { Sparkles, BookOpen, Users, Globe, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const actions = [
  {
    icon: Sparkles,
    title: "Use Publeesh AI",
    desc: "AI-powered research tools",
    link: "/dashboard/generate-paper",
  },
  {
    icon: BookOpen,
    title: "Publish a Paper",
    desc: "Submit your manuscript",
    link: "/dashboard/publishing/submit",
  },
  {
    icon: Users,
    title: "Join the Network",
    desc: "Connect with scholars",
    link: "/dashboard/network",
  },
  {
    icon: Globe,
    title: "Institutional Collaboration",
    desc: "Build academic partnerships",
    link: "/dashboard/institutional",
  },
];

export default function WelcomePanel() {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem("afrikascholar_welcome_dismissed") === "true";
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem("afrikascholar_welcome_dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="bg-card rounded-2xl border border-accent/20 p-6 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      <h2 className="text-lg font-bold text-foreground mb-1">
        Start exploring Afrika Scholar
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Jump into any module to get started. Features unlock as you go.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((a) => (
          <Link
            key={a.title}
            to={a.link}
            className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-accent/40 hover:shadow-sm transition-all group"
          >
            <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <a.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {a.desc}
                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
