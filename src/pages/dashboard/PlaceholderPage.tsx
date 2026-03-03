import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  breadcrumbs: string[];
  description: string;
}

const PlaceholderPage = ({ title, breadcrumbs, description }: Props) => (
  <DashboardLayout>
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        {breadcrumbs.map((b, i) => (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            <span className={i === breadcrumbs.length - 1 ? "text-foreground font-medium" : ""}>{b}</span>
          </span>
        ))}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <p className="text-muted-foreground">This feature is coming soon.</p>
        <p className="text-xs text-muted-foreground mt-2">We're building this module as part of the unified Afrika Scholar platform.</p>
        <Link to="/dashboard" className="mt-4 inline-block">
          <Button variant="afrikaOutline" size="sm">← Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  </DashboardLayout>
);

export default PlaceholderPage;
