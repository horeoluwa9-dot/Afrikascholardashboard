import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Eye } from "lucide-react";
import { useAdvisoryCases, DocStatus } from "@/hooks/useAdvisoryCases";
import { CaseIdPill } from "@/components/dashboard/advisory/StatusBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const docStatusStyles: Record<DocStatus, string> = {
  missing: "bg-red-100 text-red-700",
  submitted: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};
const docStatusLabel: Record<DocStatus, string> = {
  missing: "Missing", submitted: "Submitted", under_review: "Under Review", approved: "Approved", rejected: "Rejected",
};

export default function DocumentUploadsPage() {
  const { cases, uploadDoc } = useAdvisoryCases();
  const [open, setOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const allDocs = useMemo(() =>
    cases.flatMap(c => c.docs.map(d => ({ ...d, caseId: c.id, caseType: c.type }))), [cases]
  );

  const summary = {
    total: allDocs.filter(d => d.status !== "missing").length,
    approved: allDocs.filter(d => d.status === "approved").length,
    pending: allDocs.filter(d => d.status === "submitted" || d.status === "under_review").length,
    rejected: allDocs.filter(d => d.status === "rejected").length,
  };

  const submit = () => {
    if (!selectedCase || !selectedDoc || !fileName) { toast.error("Please complete all fields."); return; }
    uploadDoc(selectedCase, selectedDoc, fileName);
    toast.success("Document uploaded.");
    setOpen(false); setSelectedCase(""); setSelectedDoc(""); setFileName("");
  };

  const docOptionsForCase = (caseId: string) => cases.find(c => c.id === caseId)?.docs || [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Documents</h1>
            <p className="text-sm text-muted-foreground mt-1">All documents across your advisory cases.</p>
          </div>
          <Button variant="afrika" className="gap-2" onClick={() => setOpen(true)}>
            <Upload className="h-4 w-4" /> Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatPill label="Total Uploaded" value={summary.total} />
          <StatPill label="Approved" value={summary.approved} tone="emerald" />
          <StatPill label="Pending Review" value={summary.pending} tone="amber" />
          <StatPill label="Rejected" value={summary.rejected} tone="red" />
        </div>

        <Card>
          {allDocs.length === 0 ? (
            <CardContent className="py-12 text-center">
              <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No documents uploaded yet. Check your cases for required documents.</p>
              <Link to="/dashboard/advisory/cases" className="text-primary text-sm hover:underline mt-2 inline-block">Go to My Cases →</Link>
            </CardContent>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr className="text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Document</th>
                  <th className="px-4 py-3 font-medium">Case</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {allDocs.map(d => (
                  <tr key={`${d.caseId}-${d.id}`} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{d.name}</td>
                    <td className="px-4 py-3"><CaseIdPill id={d.caseId} /></td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium", docStatusStyles[d.status])}>
                        {docStatusLabel[d.status]}
                      </span>
                      {d.status === "rejected" && d.rejectionReason && (
                        <p className="text-xs text-red-600 mt-1">{d.rejectionReason}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{d.fileName || "—"}</td>
                    <td className="px-4 py-3">
                      <Link to={`/dashboard/advisory/cases/${d.caseId}`} className="text-primary text-sm hover:underline gap-1 inline-flex items-center">
                        <Eye className="h-3.5 w-3.5" /> View Case
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Case</label>
              <Select value={selectedCase} onValueChange={(v) => { setSelectedCase(v); setSelectedDoc(""); }}>
                <SelectTrigger><SelectValue placeholder="Select case" /></SelectTrigger>
                <SelectContent>
                  {cases.map(c => <SelectItem key={c.id} value={c.id}>{c.id} — {c.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {selectedCase && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Document Type</label>
                <Select value={selectedDoc} onValueChange={setSelectedDoc}>
                  <SelectTrigger><SelectValue placeholder="Select document" /></SelectTrigger>
                  <SelectContent>
                    {docOptionsForCase(selectedCase).map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary"
            >
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{fileName || "Click to browse — PDF, JPG, PNG (max 10MB)"}</p>
              <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="afrika" onClick={submit}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function StatPill({ label, value, tone }: { label: string; value: number; tone?: "emerald" | "amber" | "red" }) {
  const c = tone === "emerald" ? "text-emerald-600" : tone === "amber" ? "text-amber-600" : tone === "red" ? "text-red-600" : "text-primary";
  return (
    <Card><CardContent className="p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("text-2xl font-bold mt-1", c)}>{value}</p>
    </CardContent></Card>
  );
}
