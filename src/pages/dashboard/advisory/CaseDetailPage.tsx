import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdvisoryCase, TYPE_LABEL, DocStatus, RequiredDoc } from "@/hooks/useAdvisoryCases";
import { StatusBadge, CaseIdPill } from "@/components/dashboard/advisory/StatusBadge";
import { Paperclip, Send, Upload, FileText, Download, MessageSquare, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STAGES = [
  { key: "pending", label: "Request Submitted" },
  { key: "assigned", label: "Advisor Assigned" },
  { key: "awaiting_documents", label: "Documents Requested" },
  { key: "in_progress", label: "Processing" },
  { key: "processing_institution", label: "Dispatched" },
  { key: "completed", label: "Completed" },
];

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

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { case: c, sendMessage, uploadDoc, payCase } = useAdvisoryCase(id);
  const [msg, setMsg] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [uploadFor, setUploadFor] = useState<RequiredDoc | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [c?.messages.length]);

  if (!c) {
    return <DashboardLayout><div className="max-w-4xl mx-auto py-12 text-center">
      <p className="text-muted-foreground mb-4">Case not found.</p>
      <Button onClick={() => navigate("/dashboard/advisory/cases")}>Back to My Cases</Button>
    </div></DashboardLayout>;
  }

  const currentStageIdx = STAGES.findIndex(s => s.key === c.status);

  const handleSend = () => {
    if (!msg.trim()) return;
    sendMessage(c.id, msg.trim());
    setMsg("");
  };

  const confirmUpload = () => {
    if (!uploadFor || !fileName) { toast.error("Please choose a file"); return; }
    uploadDoc(c.id, uploadFor.id, fileName);
    toast.success(`${uploadFor.name} uploaded`);
    setUploadFor(null); setFileName("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          <Link to="/dashboard/advisory/cases" className="hover:text-foreground">My Cases</Link>
          <ChevronRight className="h-4 w-4 inline mx-1" />
          <span className="text-foreground">{c.id}</span>
        </div>

        {/* Header */}
        <div className="flex items-start gap-3 flex-wrap">
          <CaseIdPill id={c.id} />
          <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-medium">{TYPE_LABEL[c.type]}</span>
          <StatusBadge status={c.status} />
          <span className="text-xs text-muted-foreground ml-auto">Updated {fmtTime(c.updatedAt)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* LEFT 70% */}
          <div className="lg:col-span-7 space-y-6">
            {/* Timeline */}
            <Card>
              <CardContent className="p-6">
                <div className="hidden md:flex items-center justify-between gap-2">
                  {STAGES.map((s, i) => {
                    const done = i < currentStageIdx;
                    const active = i === currentStageIdx;
                    return (
                      <div key={s.key} className="flex-1 flex flex-col items-center text-center relative">
                        <div className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center border-2 z-10 bg-card",
                          done && "bg-primary border-primary text-primary-foreground",
                          active && "bg-orange-500 border-orange-500 text-white animate-pulse",
                          !done && !active && "border-border text-muted-foreground"
                        )}>
                          {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3 fill-current" />}
                        </div>
                        <p className="text-[11px] mt-2 text-foreground">{s.label}</p>
                        {i < STAGES.length - 1 && (
                          <div className={cn("absolute top-4 left-1/2 right-[-50%] h-0.5", i < currentStageIdx ? "bg-primary" : "bg-border")} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="md:hidden space-y-3">
                  {STAGES.map((s, i) => (
                    <div key={s.key} className="flex items-center gap-3">
                      <div className={cn("h-7 w-7 rounded-full flex items-center justify-center",
                        i < currentStageIdx ? "bg-primary text-primary-foreground" : i === currentStageIdx ? "bg-orange-500 text-white" : "bg-secondary text-muted-foreground")}>
                        {i < currentStageIdx ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
                      </div>
                      <p className="text-sm">{s.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Case Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-semibold text-foreground mb-4">Case Details</h2>
                <div className="space-y-2">
                  <DetailRow k="Description" v={c.description} />
                  {Object.entries(c.fields).map(([k, v]) => <DetailRow key={k} k={k} v={v} />)}
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-foreground">Required Documents</h2>
                <div className="divide-y divide-border">
                  {c.docs.map(d => (
                    <div key={d.id} className="flex items-center gap-3 py-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{d.name}</p>
                        {d.fileName && <p className="text-xs text-muted-foreground truncate">{d.fileName}</p>}
                        {d.status === "rejected" && d.rejectionReason && (
                          <p className="text-xs text-red-600 mt-1">{d.rejectionReason}</p>
                        )}
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-md text-xs font-medium", docStatusStyles[d.status])}>
                        {docStatusLabel[d.status]}
                      </span>
                      {(d.status === "missing" || d.status === "rejected") && (
                        <Button size="sm" variant="outline" onClick={() => { setUploadFor(d); setFileName(""); }}>Upload</Button>
                      )}
                      {d.fileName && d.status !== "missing" && (
                        <Button size="sm" variant="ghost" className="text-primary">View</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communication */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-foreground flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Messages</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {c.messages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No messages yet. Your advisor will reach out once your case is assigned.
                    </p>
                  )}
                  {c.messages.map(m => (
                    <div key={m.id} className={cn("flex", m.from === "client" ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] rounded-lg px-3 py-2",
                        m.from === "client" ? "bg-primary/10" : "bg-card border-l-2 border-primary border border-border"
                      )}>
                        <p className="text-[11px] text-muted-foreground mb-1">
                          {m.from === "client" ? "You" : c.advisor?.name || "Advisor"} · {fmtTime(m.at)}
                        </p>
                        <p className="text-sm text-foreground">{m.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center gap-2 border-t border-border pt-4">
                  <Button size="icon" variant="ghost"><Paperclip className="h-4 w-4" /></Button>
                  <Input placeholder="Type a message..." value={msg} onChange={e => setMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
                  <Button onClick={handleSend} className="gap-1.5"><Send className="h-4 w-4" /> Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT 30% */}
          <div className="lg:col-span-3 space-y-4">
            {/* Advisor */}
            <Card><CardContent className="p-5 space-y-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Your Advisor</p>
              {c.advisor ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {c.advisor.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{c.advisor.name}</p>
                      <p className="text-xs text-muted-foreground">{c.advisor.role}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Send Message</Button>
                </>
              ) : (
                <>
                  <span className="inline-block px-2 py-1 rounded-md bg-amber-100 text-amber-700 text-xs">Awaiting Assignment</span>
                  <p className="text-xs text-muted-foreground">An advisor will be assigned to your case shortly.</p>
                </>
              )}
            </CardContent></Card>

            {/* Payment */}
            <Card><CardContent className="p-5 space-y-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment</p>
              <p className="text-2xl font-bold">₦{c.fee.toLocaleString()}</p>
              <span className={cn("inline-block px-2 py-0.5 rounded-md text-xs font-medium",
                c.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" :
                c.paymentStatus === "partial" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
              )}>
                {c.paymentStatus === "paid" ? "Paid" : c.paymentStatus === "partial" ? "Partial" : "Pending"}
              </span>
              <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border">
                <div className="flex justify-between"><span>Advisory Fee</span><span>₦{Math.round(c.fee * 0.4).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Processing Fee</span><span>₦{Math.round(c.fee * 0.6).toLocaleString()}</span></div>
              </div>
              {c.paymentStatus !== "paid" ? (
                <Button variant="afrika" className="w-full" onClick={() => setPayOpen(true)}>Pay Now</Button>
              ) : (
                <Button variant="outline" className="w-full gap-1.5"><Download className="h-3.5 w-3.5" /> View Invoice</Button>
              )}
            </CardContent></Card>

            {/* Actions */}
            <Card><CardContent className="p-5 space-y-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Actions</p>
              <Button variant="outline" className="w-full justify-start gap-2"
                onClick={() => { const d = c.docs.find(x => x.status === "missing"); if (d) { setUploadFor(d); setFileName(""); } else toast.info("All required documents are uploaded."); }}>
                <Upload className="h-4 w-4" /> Upload Document
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => document.querySelector('input[placeholder="Type a message..."]')?.scrollIntoView({ behavior: "smooth" })}>
                <MessageSquare className="h-4 w-4" /> Send Message
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2"
                onClick={() => toast.info("Case summary download coming soon.")}>
                <Download className="h-4 w-4" /> Download Case Summary
              </Button>
            </CardContent></Card>
          </div>
        </div>
      </div>

      {/* Upload modal */}
      <Dialog open={!!uploadFor} onOpenChange={(o) => !o && setUploadFor(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload {uploadFor?.name}</DialogTitle></DialogHeader>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary">
            <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{fileName || "Click to browse — PDF, JPG, PNG (max 10MB)"}</p>
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUploadFor(null)}>Cancel</Button>
            <Button variant="afrika" onClick={confirmUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment modal */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Complete Payment</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Case <span className="font-mono">{c.id}</span></p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>Advisory Service Fee</span><span>₦{Math.round(c.fee * 0.4).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Processing Fee</span><span>₦{Math.round(c.fee * 0.6).toLocaleString()}</span></div>
              <div className="flex justify-between font-bold border-t border-border pt-2 mt-2"><span>Total</span><span>₦{c.fee.toLocaleString()}</span></div>
            </div>
            <div className="space-y-2">
              <Input placeholder="Card number" />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="MM/YY" />
                <Input placeholder="CVV" />
              </div>
              <Input placeholder="Name on card" />
            </div>
            <p className="text-[11px] text-muted-foreground">Secured by Paystack. Your card details are encrypted.</p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPayOpen(false)}>Cancel</Button>
            <Button variant="afrika" onClick={() => { payCase(c.id); setPayOpen(false); toast.success("Payment successful. Your case is now being processed."); }}>
              Pay ₦{c.fee.toLocaleString()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function DetailRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-border last:border-0">
      <span className="text-xs text-muted-foreground">{k}</span>
      <span className="text-sm font-medium text-right">{v}</span>
    </div>
  );
}
