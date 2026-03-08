import { Link } from "react-router-dom";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building2, BookOpen, MapPin, Pencil, Eye } from "lucide-react";

const roleLabels: Record<AppRole, string> = {
  researcher: "Researcher",
  student: "Student",
  reviewer: "Reviewer",
  institutional_admin: "Institutional Admin",
};

const roleColors: Record<AppRole, string> = {
  researcher: "bg-accent/10 text-accent",
  student: "bg-primary/10 text-primary",
  reviewer: "bg-afrika-green/10 text-afrika-green",
  institutional_admin: "bg-amber-500/10 text-amber-600",
};

export default function ResearchIdentityCard() {
  const { profile, role } = useAuth();

  const displayName = profile?.display_name || "Researcher";
  const institution = profile?.institution || "Not specified";
  const discipline = profile?.discipline || "Not specified";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="bg-card rounded-xl border border-border p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xl font-bold shrink-0">
          {initial}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
            {role && (
              <Badge className={`text-[10px] ${roleColors[role]}`}>
                {roleLabels[role]}
              </Badge>
            )}
          </div>

          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{institution}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{discipline}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <Link to="/dashboard/profile">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs w-full">
              <Eye className="h-3 w-3" /> View
            </Button>
          </Link>
          <Link to="/dashboard/settings">
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs w-full">
              <Pencil className="h-3 w-3" /> Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
