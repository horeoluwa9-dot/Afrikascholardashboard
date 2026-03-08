import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface AcademicConnection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  // joined profile data
  profile?: {
    display_name: string | null;
    institution: string | null;
    discipline: string | null;
    avatar_url: string | null;
    user_id: string;
  };
}

export interface AdvisoryProfile {
  id: string;
  user_id: string;
  specialization: string;
  services: string[];
  hourly_rate: string | null;
  is_available: boolean | null;
  profile?: {
    display_name: string | null;
    institution: string | null;
    avatar_url: string | null;
  };
}

export interface AdvisoryRequest {
  id: string;
  requester_id: string;
  advisor_id: string;
  institution: string | null;
  topic: string;
  description: string | null;
  expected_duration: string | null;
  status: string;
  created_at: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  institution: string;
  location: string | null;
  description: string | null;
  requirements: string | null;
  application_deadline: string | null;
  job_type: string | null;
  created_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_id: string;
  cv_url: string | null;
  cover_letter_url: string | null;
  research_statement: string | null;
  status: string;
  created_at: string;
  job?: JobOpportunity;
}

export interface Engagement {
  id: string;
  user_id: string;
  title: string;
  institution: string | null;
  engagement_type: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  created_at: string;
}

export function useNetwork() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connections, setConnections] = useState<AcademicConnection[]>([]);
  const [advisoryProfiles, setAdvisoryProfiles] = useState<AdvisoryProfile[]>([]);
  const [advisoryRequests, setAdvisoryRequests] = useState<AdvisoryRequest[]>([]);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [allProfiles, setAllProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [connRes, advProfRes, advReqRes, jobRes, appRes, engRes, profilesRes] = await Promise.all([
      supabase.from("academic_connections").select("*").or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`),
      supabase.from("advisory_profiles").select("*"),
      supabase.from("advisory_requests").select("*").or(`requester_id.eq.${user.id},advisor_id.eq.${user.id}`),
      supabase.from("job_opportunities").select("*").order("created_at", { ascending: false }),
      supabase.from("job_applications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("engagements").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, display_name, institution, discipline, avatar_url, country, academic_title, position"),
    ]);

    const profileMap = new Map<string, any>();
    if (profilesRes.data) {
      profilesRes.data.forEach((p: any) => profileMap.set(p.user_id, p));
      setAllProfiles(profilesRes.data.filter((p: any) => p.user_id !== user.id));
    }

    if (connRes.data) {
      setConnections(connRes.data.map((c: any) => {
        const otherId = c.requester_id === user.id ? c.receiver_id : c.requester_id;
        return { ...c, profile: profileMap.get(otherId) };
      }));
    }

    if (advProfRes.data) {
      setAdvisoryProfiles(advProfRes.data.map((a: any) => ({
        ...a,
        services: a.services || [],
        profile: profileMap.get(a.user_id),
      })));
    }

    if (advReqRes.data) setAdvisoryRequests(advReqRes.data as AdvisoryRequest[]);
    if (jobRes.data) setJobs(jobRes.data as JobOpportunity[]);
    if (appRes.data) {
      // Join job data
      const jobMap = new Map<string, JobOpportunity>();
      if (jobRes.data) (jobRes.data as JobOpportunity[]).forEach(j => jobMap.set(j.id, j));
      setApplications((appRes.data as any[]).map(a => ({ ...a, job: jobMap.get(a.job_id) })));
    }
    if (engRes.data) setEngagements(engRes.data as Engagement[]);

    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const sendConnectionRequest = async (receiverId: string) => {
    if (!user) return;
    const { error } = await supabase.from("academic_connections").insert({
      requester_id: user.id, receiver_id: receiverId,
    } as any);
    if (error) {
      if (error.code === "23505") { toast({ title: "Already connected" }); return; }
      toast({ title: "Error", description: error.message, variant: "destructive" }); return;
    }
    toast({ title: "Connection request sent" });
    await fetchAll();
  };

  const acceptConnection = async (id: string) => {
    const { error } = await supabase.from("academic_connections").update({ status: "accepted" } as any).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Connection accepted" });
    await fetchAll();
  };

  const submitAdvisoryRequest = async (req: Omit<AdvisoryRequest, "id" | "requester_id" | "status" | "created_at">) => {
    if (!user) return;
    const { error } = await supabase.from("advisory_requests").insert({
      ...req, requester_id: user.id,
    } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Advisory request submitted" });
    await fetchAll();
  };

  const submitApplication = async (jobId: string, data: { research_statement?: string; cv_url?: string; cover_letter_url?: string }) => {
    if (!user) return;
    const { error } = await supabase.from("job_applications").insert({
      user_id: user.id, job_id: jobId, ...data,
    } as any);
    if (error) {
      if (error.code === "23505") { toast({ title: "Already applied" }); return; }
      toast({ title: "Error", description: error.message, variant: "destructive" }); return;
    }
    toast({ title: "Application submitted" });
    await fetchAll();
  };

  const withdrawApplication = async (id: string) => {
    const { error } = await supabase.from("job_applications").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Application withdrawn" });
    await fetchAll();
  };

  const connectedUserIds = new Set(connections.filter(c => c.status === "accepted").map(c =>
    c.requester_id === user?.id ? c.receiver_id : c.requester_id
  ));
  const pendingUserIds = new Set(connections.filter(c => c.status === "pending").map(c =>
    c.requester_id === user?.id ? c.receiver_id : c.requester_id
  ));

  return {
    connections, advisoryProfiles, advisoryRequests, jobs, applications, engagements,
    allProfiles, loading, connectedUserIds, pendingUserIds,
    sendConnectionRequest, acceptConnection, submitAdvisoryRequest,
    submitApplication, withdrawApplication, refetch: fetchAll,
  };
}
