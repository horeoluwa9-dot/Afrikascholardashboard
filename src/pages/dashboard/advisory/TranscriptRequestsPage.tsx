import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Eye, FileUp, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TranscriptRequest {
  id: string;
  institution: string;
  program: string;
  graduation_year: number;
  request_date: string;
  status: string;
  delivery_format: string;
}

const sampleRequests: TranscriptRequest[] = [
  { id: "t1", institution: "University of Ibadan", program: "BSc Economics", graduation_year: 2022, request_date: "2026-03-05", status: "processing", delivery_format: "Digital Copy" },
  { id: "t2", institution: "University of Lagos", program: "BSc Computer Science", graduation_year: 2021, request_date: "2026-02-20", status: "completed", delivery_format: "Hard Copy" },
  { id: "t3", institution: "Makerere University", program: "BA Education", graduation_year: 2023, request_date: "2026-01-15", status: "pending", delivery_format: "Digital Copy" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pending", variant: "outline" },
  processing: { label: "Processing", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
};

const TranscriptRequestsPage = () => {
  const [requests] = useState(sampleRequests);
  const [viewRequest, setViewRequest] = useState<TranscriptRequest | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ institution: "", program: "", graduation_year: "", delivery_format: "digital" });

  const handleSubmit = () => {
    if (!form.institution || !form.program || !form.graduation_year) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Transcript request submitted successfully!");
    setShowCreate(false);
    setForm({ institution: "", program: "", graduation_year: "", delivery_format: "digital" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transcript Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">Request academic transcript processing from institutions.</p>
          </div>
          <Button variant="afrika" className="gap-1.5" onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> Request Transcript
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Requests", value: requests.length, icon: FileText, color: "text-accent", bg: "bg-accent/10" },
            { label: "Processing", value: requests.filter(r => r.status === "processing").length, icon: Loader2, color: "text-primary", bg: "bg-primary/10" },
            { label: "Completed", value: requests.filter(r => r.status === "completed").length, icon: CheckCircle, color: "text-afrika-green", bg: "bg-afrika-green/10" },
          ].map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                  </div>
                  <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Graduation Year</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(r => {
                const sc = statusConfig[r.status] || statusConfig.pending;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm">{r.institution}</TableCell>
                    <TableCell className="text-sm">{r.program}</TableCell>
                    <TableCell className="text-sm">{r.graduation_year}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(r.request_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sc.variant} className="text-[10px]">{sc.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setViewRequest(r)}>
                        <Eye className="h-3 w-3" /> View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs gap-1">
                        <FileUp className="h-3 w-3" /> Upload
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewRequest} onOpenChange={(open) => !open && setViewRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Transcript Request</DialogTitle></DialogHeader>
          {viewRequest && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Institution</p><p className="font-medium">{viewRequest.institution}</p></div>
                <div><p className="text-muted-foreground text-xs">Program</p><p className="font-medium">{viewRequest.program}</p></div>
                <div><p className="text-muted-foreground text-xs">Graduation Year</p><p className="font-medium">{viewRequest.graduation_year}</p></div>
                <div><p className="text-muted-foreground text-xs">Delivery Format</p><p className="font-medium">{viewRequest.delivery_format}</p></div>
                <div><p className="text-muted-foreground text-xs">Status</p>
                  <Badge variant={statusConfig[viewRequest.status]?.variant || "secondary"} className="text-[10px] mt-0.5">
                    {statusConfig[viewRequest.status]?.label || viewRequest.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Request Transcript</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Institution Name *</Label>
              <Input className="mt-1.5" placeholder="e.g. University of Lagos" value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} />
            </div>
            <div>
              <Label>Program Studied *</Label>
              <Input className="mt-1.5" placeholder="e.g. BSc Computer Science" value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))} />
            </div>
            <div>
              <Label>Year of Graduation *</Label>
              <Input className="mt-1.5" type="number" placeholder="e.g. 2022" value={form.graduation_year} onChange={e => setForm(f => ({ ...f, graduation_year: e.target.value }))} />
            </div>
            <div>
              <Label>Delivery Format</Label>
              <Select value={form.delivery_format} onValueChange={v => setForm(f => ({ ...f, delivery_format: v }))}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="digital">Digital Copy</SelectItem>
                  <SelectItem value="hardcopy">Hard Copy</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSubmit}>Submit Request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TranscriptRequestsPage;
