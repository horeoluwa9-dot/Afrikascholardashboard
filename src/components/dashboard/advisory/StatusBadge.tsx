import { CaseStatus, STATUS_LABEL } from "@/hooks/useAdvisoryCases";
import { cn } from "@/lib/utils";

const styles: Record<CaseStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  assigned: "bg-blue-100 text-blue-700",
  awaiting_documents: "bg-purple-100 text-purple-700",
  in_progress: "bg-indigo-100 text-indigo-700",
  processing_institution: "bg-orange-100 text-orange-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export function StatusBadge({ status, className }: { status: CaseStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", styles[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function CaseIdPill({ id }: { id: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-xs cursor-pointer"
      onClick={() => { navigator.clipboard?.writeText(id); }}
      title="Click to copy">
      {id}
    </span>
  );
}
