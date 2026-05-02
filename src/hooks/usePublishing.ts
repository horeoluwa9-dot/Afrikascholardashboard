import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ManuscriptSubmission {
  id: string;
  user_id: string;
  title: string;
  abstract: string | null;
  keywords: string | null;
  research_field: string | null;
  journal_name: string;
  journal_id: string | null;
  manuscript_url: string | null;
  cover_letter: string | null;
  co_authors: any[];
  status: string;
  workflow_stage: string;
  reviewer_feedback: any[];
  submitted_at: string;
  updated_at: string;
  is_paid?: boolean;
  price_amount?: number;
  total_earnings?: number;
  view_count?: number;
  download_count?: number;
}

export interface Journal {
  id: string;
  name: string;
  description: string | null;
  issn: string | null;
  publisher: string | null;
  website_url: string | null;
  created_by: string | null;
  created_at: string;
}

export interface EditorialBoardMember {
  id: string;
  journal_id: string;
  user_id: string;
  role: string;
  display_name: string | null;
  institution: string | null;
  added_at: string;
}

export function usePublishing() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;

  const submissions = useQuery({
    queryKey: ["manuscript_submissions", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("manuscript_submissions")
        .select("*")
        .eq("user_id", uid!)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data as ManuscriptSubmission[];
    },
  });

  const journals = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("journals").select("*").order("name");
      if (error) throw error;
      return data as Journal[];
    },
  });

  const myJournals = useQuery({
    queryKey: ["my_journals", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase.from("journals").select("*").eq("created_by", uid!);
      if (error) throw error;
      return data as Journal[];
    },
  });

  const submitManuscript = useMutation({
    mutationFn: async (ms: Omit<ManuscriptSubmission, "id" | "user_id" | "submitted_at" | "updated_at" | "status" | "workflow_stage" | "reviewer_feedback">) => {
      const { error } = await supabase.from("manuscript_submissions").insert({
        ...ms, user_id: uid!, status: "submitted", workflow_stage: "submission_received", reviewer_feedback: [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["manuscript_submissions"] });
      toast.success("Manuscript submitted successfully");
    },
    onError: () => toast.error("Failed to submit manuscript"),
  });

  const updateSubmission = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ManuscriptSubmission> & { id: string }) => {
      const { error } = await supabase.from("manuscript_submissions").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["manuscript_submissions"] });
      toast.success("Submission updated");
    },
    onError: () => toast.error("Failed to update submission"),
  });

  const createJournal = useMutation({
    mutationFn: async (j: Omit<Journal, "id" | "created_at" | "created_by">) => {
      const { error } = await supabase.from("journals").insert({ ...j, created_by: uid! });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["journals"] });
      qc.invalidateQueries({ queryKey: ["my_journals"] });
      toast.success("Journal created");
    },
    onError: () => toast.error("Failed to create journal"),
  });

  const getBoardMembers = async (journalId: string) => {
    const { data, error } = await supabase
      .from("editorial_board_members")
      .select("*")
      .eq("journal_id", journalId)
      .order("added_at");
    if (error) throw error;
    return data as EditorialBoardMember[];
  };

  const addBoardMember = useMutation({
    mutationFn: async (m: Omit<EditorialBoardMember, "id" | "added_at">) => {
      const { error } = await supabase.from("editorial_board_members").insert(m);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Board member added"),
    onError: () => toast.error("Failed to add board member"),
  });

  const removeBoardMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("editorial_board_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Board member removed"),
    onError: () => toast.error("Failed to remove board member"),
  });

  return {
    submissions: submissions.data || [],
    journals: journals.data || [],
    myJournals: myJournals.data || [],
    loading: submissions.isLoading,
    submitManuscript,
    updateSubmission,
    createJournal,
    getBoardMembers,
    addBoardMember,
    removeBoardMember,
  };
}
