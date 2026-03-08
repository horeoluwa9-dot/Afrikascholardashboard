import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface AIPaper {
  id: string;
  user_id: string;
  title: string;
  research_field: string | null;
  paper_type: string;
  target_journal: string | null;
  citation_style: string;
  sections: string[];
  content: Record<string, string>;
  sources: any[];
  status: string;
  credits_used: number;
  created_at: string;
  updated_at: string;
}

export interface PaperSetup {
  title: string;
  research_field: string;
  paper_type: string;
  target_journal?: string;
  citation_style: string;
  sections: string[];
}

export function useAIPapers() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;

  const papers = useQuery({
    queryKey: ["ai_papers", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_papers" as any)
        .select("*")
        .eq("user_id", uid!)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data as any[]).map((d: any) => ({
        ...d,
        sections: Array.isArray(d.sections) ? d.sections : [],
        content: typeof d.content === "object" && d.content !== null ? d.content : {},
        sources: Array.isArray(d.sources) ? d.sources : [],
      })) as AIPaper[];
    },
  });

  const createPaper = useMutation({
    mutationFn: async (setup: PaperSetup) => {
      const { data, error } = await supabase
        .from("ai_papers" as any)
        .insert({
          user_id: uid!,
          title: setup.title,
          research_field: setup.research_field,
          paper_type: setup.paper_type,
          target_journal: setup.target_journal || null,
          citation_style: setup.citation_style,
          sections: setup.sections,
          content: {},
          sources: [],
          status: "draft",
          credits_used: 0,
        } as any)
        .select()
        .single();
      if (error) throw error;
      return data as any as AIPaper;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai_papers"] });
      toast.success("Paper workspace created");
    },
    onError: () => toast.error("Failed to create paper"),
  });

  const updatePaper = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AIPaper> & { id: string }) => {
      const { error } = await supabase
        .from("ai_papers" as any)
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai_papers"] });
    },
    onError: () => toast.error("Failed to save paper"),
  });

  const deletePaper = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ai_papers" as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai_papers"] });
      toast.success("Paper deleted");
    },
    onError: () => toast.error("Failed to delete paper"),
  });

  return {
    papers: papers.data || [],
    loading: papers.isLoading,
    createPaper,
    updatePaper,
    deletePaper,
  };
}
