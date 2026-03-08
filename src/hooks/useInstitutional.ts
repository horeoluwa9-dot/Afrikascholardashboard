import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface TalentRequest {
  id: string;
  user_id: string;
  title: string;
  institution_name: string;
  expertise_area: string;
  description: string | null;
  expected_duration: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCollaboration {
  id: string;
  user_id: string;
  title: string;
  partner_institution: string;
  research_area: string;
  description: string | null;
  expected_duration: string | null;
  status: string;
  start_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Engagement {
  id: string;
  user_id: string;
  title: string;
  institution: string | null;
  engagement_type: string;
  status: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

export function useInstitutional() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;

  const talentRequests = useQuery({
    queryKey: ["talent_requests", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talent_requests")
        .select("*")
        .eq("user_id", uid!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TalentRequest[];
    },
  });

  const collaborations = useQuery({
    queryKey: ["project_collaborations", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_collaborations")
        .select("*")
        .eq("user_id", uid!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProjectCollaboration[];
    },
  });

  const engagements = useQuery({
    queryKey: ["engagements", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("engagements")
        .select("*")
        .eq("user_id", uid!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Engagement[];
    },
  });

  const createTalentRequest = useMutation({
    mutationFn: async (req: Omit<TalentRequest, "id" | "user_id" | "created_at" | "updated_at" | "status">) => {
      const { error } = await supabase.from("talent_requests").insert({ ...req, user_id: uid! });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["talent_requests"] });
      toast.success("Talent request published");
    },
    onError: () => toast.error("Failed to create talent request"),
  });

  const updateTalentRequest = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TalentRequest> & { id: string }) => {
      const { error } = await supabase.from("talent_requests").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["talent_requests"] });
      toast.success("Request updated");
    },
    onError: () => toast.error("Failed to update request"),
  });

  const createCollaboration = useMutation({
    mutationFn: async (collab: Omit<ProjectCollaboration, "id" | "user_id" | "created_at" | "updated_at" | "status">) => {
      const { error } = await supabase.from("project_collaborations").insert({ ...collab, user_id: uid! });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["project_collaborations"] });
      toast.success("Collaboration created");
    },
    onError: () => toast.error("Failed to create collaboration"),
  });

  const createEngagement = useMutation({
    mutationFn: async (eng: Omit<Engagement, "id" | "user_id" | "created_at">) => {
      const { error } = await supabase.from("engagements").insert({ ...eng, user_id: uid! });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["engagements"] });
      toast.success("Engagement created");
    },
    onError: () => toast.error("Failed to create engagement"),
  });

  // Lecturer search across profiles
  const searchLecturers = async (filters: { field?: string; institution?: string; country?: string }) => {
    let q = supabase.from("profiles").select("*");
    if (filters.field) q = q.ilike("discipline", `%${filters.field}%`);
    if (filters.institution) q = q.ilike("institution", `%${filters.institution}%`);
    if (filters.country) q = q.ilike("country", `%${filters.country}%`);
    const { data, error } = await q.limit(50);
    if (error) throw error;
    return data;
  };

  return {
    talentRequests: talentRequests.data || [],
    collaborations: collaborations.data || [],
    engagements: engagements.data || [],
    loading: talentRequests.isLoading || collaborations.isLoading || engagements.isLoading,
    createTalentRequest,
    updateTalentRequest,
    createCollaboration,
    createEngagement,
    searchLecturers,
  };
}
