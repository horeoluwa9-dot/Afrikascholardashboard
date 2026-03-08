import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Handshake, Send, Inbox, Clock, CheckCircle, XCircle, MessageCircle, ArrowRight, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdvisoryRequest {
  id: string;
  topic: string;
  description: string | null;
  institution: string | null;
  expected_duration: string | null;
  status: string;
  created_at: string;
  counterpart_name: string;
}

const sampleSent: AdvisoryRequest[] = [
  { id: "s1", topic: "Energy Policy Research", description: "Need guidance on renewable energy frameworks in West Africa.", institution: "University of Ghana", expected_duration: "3 months", status: "pending", created_at: "2026-03-05", counterpart_name: "Dr. Kofi Mensah" },
  { id: "s2", topic: "Public Health Data Analysis", description: "Advisory on statistical methods for health survey analysis.", institution: "Makerere University", expected_duration: "1 month", status: "accepted", created_at: "2026-02-20", counterpart_name: "Dr. Amina Osei" },
  { id: "s3", topic: "AI Ethics in Education", description: "Seeking advisory on ethical AI implementation in university settings.", institution: null, expected_duration: "2 months", status: "declined", created_at: "2026-01-15", counterpart_name: "Prof. Ngozi Adeyemi" },
];

const sampleReceived: AdvisoryRequest[] = [
  { id: "r1", topic: "Agricultural Innovation", description: "Need your expertise on sustainable farming practices research.", institution: "Mohammed V University", expected_duration: "2 months", status: "pending", created_at: "2026-03-07", counterpart_name: "Dr. Hassan El-Fassi" },
  { id: "r2", topic: "Climate Adaptation Strategies", description: "Advisory on climate resilience research methodology.", institution: "University of Cape Town", expected_duration: "3 months", status: "accepted", created_at: "2026-02-28", counterpart_name: "Dr. Thandi Nkosi" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  pending: { label: "Pending", variant: "secondary", icon: Clock },
  accepted: { label: "Accepted", variant: "default", icon: CheckCircle },
  declined: { label: "Declined", variant: "destructive", icon: XCircle },
};

const AdvisoryRequestsPage = () => {
  const { user } = useAuth();
  const [viewRequest, setViewRequest] = useState<AdvisoryRequest | null>(null);

  const handleUpdateStatus = async (request: AdvisoryRequest, newStatus: string) => {
    if (request.id.startsWith("r")) {
      toast.info("Demo mode — status updates work with real data.");
      return;
    }
    try {
      const { error } = await supabase
        .from("advisory_requests")
        .update({ status: newStatus })
        .eq("id", request.id);
      if (error) throw error;
      toast.success(`Request ${newStatus}`);
      setViewRequest(null);
    } catch {
      toast.error("Failed to update request");
    }
  };

  const sentStats = {
    total: sampleSent.length,
    pending: sampleSent.filter(r => r.status === "pending").length,
    accepted: sampleSent.filter(r => r.status === "accepted").length,
  };

  const receivedStats = {
    total: sampleReceived.length,
    pending: sampleReceived.filter(r => r.status === "pending").length,
    accepted: sampleReceived.filter(r => r.status === "accepted").length,
  };

  const stats = [
    { label: "Total Sent", value: sentStats.total, icon: Send, color: "text-accent", bg: "bg-accent/10" },
    { label: "Total Received", value: receivedStats.total, icon: Inbox, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: sentStats.pending + receivedStats.pending, icon: Clock, color: "text-afrika-orange", bg: "bg-afrika-orange-light" },
    { label: "Accepted", value: sentStats.accepted + receivedStats.accepted, icon: CheckCircle, color: "text-afrika-green", bg: "bg-afrika-green/10" },
  ];

  const renderTable = (requests: AdvisoryRequest[], type: "sent" | "received") => (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {requests.length === 0 ? (
        <div className="p-8 text-center">
          <Handshake className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No {type} advisory requests yet.</p>
          {type === "sent" && (
            <Link to="/dashboard/institutional/lecturers">
              <Button variant="afrikaOutline" size="sm" className="mt-3 gap-1">
                <Search className="h-3 w-3" /> Find Advisors
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{type === "sent" ? "Advisor" : "Requester"}</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map(r => {
              const sc = statusConfig[r.status] || statusConfig.pending;
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-sm">{r.counterpart_name}</TableCell>
                  <TableCell className="text-sm">{r.topic}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.expected_duration || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={sc.variant} className="text-[10px] gap-1">
                      <sc.icon className="h-3 w-3" /> {sc.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setViewRequest(r)}>
                      View <ArrowRight className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Advisory Requests</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage advisory requests you've sent and received from other researchers.
            </p>
          </div>
          <Link to="/dashboard/institutional/lecturers">
            <Button className="gap-1.5">
              <Search className="h-4 w-4" /> Find Advisors
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Tabs */}
        <Tabs defaultValue="sent">
          <TabsList>
            <TabsTrigger value="sent" className="gap-1.5">
              <Send className="h-3.5 w-3.5" /> Sent ({sampleSent.length})
            </TabsTrigger>
            <TabsTrigger value="received" className="gap-1.5">
              <Inbox className="h-3.5 w-3.5" /> Received ({sampleReceived.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sent" className="mt-4">
            {renderTable(sampleSent, "sent")}
          </TabsContent>
          <TabsContent value="received" className="mt-4">
            {renderTable(sampleReceived, "received")}
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!viewRequest} onOpenChange={(open) => !open && setViewRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewRequest?.topic}</DialogTitle>
          </DialogHeader>
          {viewRequest && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground text-xs">Contact</p>
                  <p className="font-medium">{viewRequest.counterpart_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge variant={statusConfig[viewRequest.status]?.variant || "secondary"} className="text-[10px] mt-0.5">
                    {statusConfig[viewRequest.status]?.label || viewRequest.status}
                  </Badge>
                </div>
                {viewRequest.institution && (
                  <div>
                    <p className="text-muted-foreground text-xs">Institution</p>
                    <p className="font-medium">{viewRequest.institution}</p>
                  </div>
                )}
                {viewRequest.expected_duration && (
                  <div>
                    <p className="text-muted-foreground text-xs">Duration</p>
                    <p className="font-medium">{viewRequest.expected_duration}</p>
                  </div>
                )}
              </div>
              {viewRequest.description && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Description</p>
                  <p className="text-foreground">{viewRequest.description}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Link to="/dashboard/messages" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <MessageCircle className="h-3 w-3" /> Message
                  </Button>
                </Link>
                {viewRequest.status === "pending" && viewRequest.id.startsWith("r") && (
                  <>
                    <Button size="sm" className="flex-1" onClick={() => handleUpdateStatus(viewRequest, "accepted")}>Accept</Button>
                    <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleUpdateStatus(viewRequest, "declined")}>Decline</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdvisoryRequestsPage;
