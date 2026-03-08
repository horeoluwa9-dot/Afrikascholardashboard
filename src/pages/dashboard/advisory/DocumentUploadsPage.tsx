import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUp, Eye, RefreshCw, File, CheckCircle, Clock, Upload } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: string;
  upload_date: string;
  status: string;
}

const sampleDocs: Document[] = [
  { id: "d1", name: "BSc Transcript — University of Ibadan", type: "Transcript", upload_date: "2026-03-05", status: "verified" },
  { id: "d2", name: "Statement of Purpose", type: "Statement", upload_date: "2026-03-03", status: "under_review" },
  { id: "d3", name: "National ID Card", type: "Identification", upload_date: "2026-03-01", status: "verified" },
  { id: "d4", name: "BSc Certificate — Makerere University", type: "Certificate", upload_date: "2026-02-20", status: "verified" },
  { id: "d5", name: "Master's Transcript Draft", type: "Transcript", upload_date: "2026-02-15", status: "pending" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  verified: { label: "Verified", variant: "default" },
  under_review: { label: "Under Review", variant: "secondary" },
  pending: { label: "Pending", variant: "outline" },
};

const docTypes = ["Transcript", "Certificate", "Statement", "Identification"];

const DocumentUploadsPage = () => {
  const [docs] = useState(sampleDocs);
  const [showUpload, setShowUpload] = useState(false);
  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const [uploadForm, setUploadForm] = useState({ name: "", type: "Transcript" });

  const handleUpload = () => {
    if (!uploadForm.name) {
      toast.error("Please enter a document name");
      return;
    }
    toast.success("Document uploaded successfully!");
    setShowUpload(false);
    setUploadForm({ name: "", type: "Transcript" });
  };

  const stats = [
    { label: "Total Documents", value: docs.length, icon: File, color: "text-accent", bg: "bg-accent/10" },
    { label: "Verified", value: docs.filter(d => d.status === "verified").length, icon: CheckCircle, color: "text-afrika-green", bg: "bg-afrika-green/10" },
    { label: "Pending Review", value: docs.filter(d => d.status !== "verified").length, icon: Clock, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Document Uploads</h1>
            <p className="text-sm text-muted-foreground mt-1">Upload and manage documents for your advisory cases.</p>
          </div>
          <Button variant="afrika" className="gap-1.5" onClick={() => setShowUpload(true)}>
            <Upload className="h-4 w-4" /> Upload Document
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(s => (
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

        {/* Supported types */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Supported:</span>
          {["Academic transcripts", "Certificates", "Statement of purpose", "Identification documents"].map(t => (
            <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map(d => {
                const sc = statusConfig[d.status] || statusConfig.pending;
                return (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium text-sm">{d.name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{d.type}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(d.upload_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sc.variant} className="text-[10px]">{sc.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setViewDoc(d)}>
                        <Eye className="h-3 w-3" /> View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs gap-1">
                        <RefreshCw className="h-3 w-3" /> Replace
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
      <Dialog open={!!viewDoc} onOpenChange={(open) => !open && setViewDoc(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Document Details</DialogTitle></DialogHeader>
          {viewDoc && (
            <div className="space-y-3 text-sm">
              <div><p className="text-muted-foreground text-xs">Name</p><p className="font-medium">{viewDoc.name}</p></div>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Type</p><Badge variant="outline" className="text-[10px] mt-0.5">{viewDoc.type}</Badge></div>
                <div><p className="text-muted-foreground text-xs">Status</p>
                  <Badge variant={statusConfig[viewDoc.status]?.variant || "secondary"} className="text-[10px] mt-0.5">
                    {statusConfig[viewDoc.status]?.label}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Document Name *</Label>
              <Input className="mt-1.5" placeholder="e.g. BSc Transcript" value={uploadForm.name} onChange={e => setUploadForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Document Type</Label>
              <Select value={uploadForm.type} onValueChange={v => setUploadForm(f => ({ ...f, type: v }))}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {docTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>File</Label>
              <div className="mt-1.5 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent/40 transition-colors">
                <FileUp className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Click or drag to upload</p>
                <p className="text-[10px] text-muted-foreground mt-1">PDF, JPG, PNG up to 20MB</p>
              </div>
            </div>
            <Button className="w-full" onClick={handleUpload}>Upload Document</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DocumentUploadsPage;
