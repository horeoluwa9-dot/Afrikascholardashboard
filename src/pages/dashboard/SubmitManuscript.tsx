import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, Send, Upload, Loader2, Copy, ExternalLink, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const journals = [
  "African Journal of Energy Studies",
  "East African Economic Review",
  "African Health Sciences Journal",
  "Journal of African Development",
  "African Journal of Science & Tech",
  "West African Journal of Medicine",
];

const SubmitManuscript = () => {
  const [title, setTitle] = useState("");
  const [journal, setJournal] = useState("");
  const [abstractText, setAbstractText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { toast } = useToast();
  const { unlockModule } = useModuleUnlocksContext();

  // Unlock publishing & my_research modules when user visits this page
  useEffect(() => {
    unlockModule("publishing");
    unlockModule("my_research");
  }, [unlockModule]);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setShowShareModal(true);
      toast({ title: "Manuscript submitted!", description: "Your manuscript has been submitted for review." });
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span>Publishing</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Submit Manuscript</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Submit Manuscript</h1>
          <p className="text-sm text-muted-foreground mt-1">Submit your research manuscript for publication review.</p>
        </div>

        {!submitted ? (
          <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="space-y-2">
              <Label>Manuscript Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter your manuscript title..." />
            </div>

            <div className="space-y-2">
              <Label>Target Journal</Label>
              <Select value={journal} onValueChange={setJournal}>
                <SelectTrigger><SelectValue placeholder="Select journal..." /></SelectTrigger>
                <SelectContent>
                  {journals.map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Abstract</Label>
              <Textarea value={abstractText} onChange={(e) => setAbstractText(e.target.value)} placeholder="Paste your abstract here..." className="min-h-[120px]" />
            </div>

            <div className="space-y-2">
              <Label>Upload Manuscript (PDF/DOCX)</Label>
              <Input type="file" accept=".pdf,.docx" />
            </div>

            <div className="space-y-2">
              <Label>Cover Letter (optional)</Label>
              <Textarea placeholder="Write a cover letter to the editor..." className="min-h-[80px]" />
            </div>

            <Button variant="afrika" size="lg" className="w-full gap-1" onClick={handleSubmit} disabled={submitting || !title || !journal}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Send className="h-4 w-4" /> Submit Manuscript</>}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-afrika-green/10 border border-afrika-green/30 rounded-xl p-4 flex items-start gap-3">
              <Check className="h-5 w-5 text-afrika-green mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Manuscript submitted successfully!</p>
                <p className="text-xs text-muted-foreground mt-0.5">Your manuscript "{title}" has been submitted to {journal}. Track its status in your submissions dashboard.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/dashboard/publishing/track">
                <Button variant="afrika" size="sm" className="gap-1">Track Submission</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => { setSubmitted(false); setTitle(""); setJournal(""); setAbstractText(""); }}>
                Submit Another
              </Button>
            </div>
          </div>
        )}

        {/* Share Modal after submission */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Share your achievement?</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Would you like to share this submission with the community?</p>
            <div className="flex flex-col gap-2 mt-2">
              <Button variant="afrika" size="sm" className="gap-1" onClick={() => { setShowShareModal(false); toast({ title: "Shared!", description: "Your update has been posted to the community." }); }}>
                Share Publicly
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowShareModal(false)}>Skip</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SubmitManuscript;
