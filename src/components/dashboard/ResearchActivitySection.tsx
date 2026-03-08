import { Link } from "react-router-dom";
import { FileText, Send, Clock, CheckCircle, ArrowRight } from "lucide-react";

interface ActivityCard {
  icon: any;
  label: string;
  count: number;
  color: string;
  link: string;
}

// TODO: Replace with real data from database
const activityCards: ActivityCard[] = [
  { icon: FileText, label: "Draft Papers", count: 2, color: "bg-muted text-muted-foreground", link: "/dashboard/my-papers?status=draft" },
  { icon: Send, label: "Submitted", count: 1, color: "bg-primary/10 text-primary", link: "/dashboard/publishing/track?status=submitted" },
  { icon: Clock, label: "Under Review", count: 1, color: "bg-amber-500/10 text-amber-600", link: "/dashboard/publishing/track?status=review" },
  { icon: CheckCircle, label: "Published", count: 0, color: "bg-afrika-green/10 text-afrika-green", link: "/dashboard/my-papers?status=published" },
];

interface Props {
  visible?: boolean;
}

export default function ResearchActivitySection({ visible = true }: Props) {
  if (!visible) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">My Research Activity</h2>
        <Link to="/dashboard/my-papers" className="text-xs text-accent hover:underline flex items-center gap-1">
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {activityCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow group"
          >
            <div className={`h-9 w-9 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold text-foreground">{card.count}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
