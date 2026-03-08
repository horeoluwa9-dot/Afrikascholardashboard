import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface AcademicCredential {
  id: string;
  user_id: string;
  degree: string;
  field_of_study: string;
  university: string;
  year_of_graduation: number | null;
}

export interface Publication {
  id: string;
  user_id: string;
  title: string;
  journal: string | null;
  status: string;
  year: number | null;
  pdf_url: string | null;
}

export interface ResearchInterest {
  id: string;
  user_id: string;
  name: string;
}

export interface ExtendedProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  institution: string | null;
  discipline: string | null;
  avatar_url: string | null;
  bio: string | null;
  department: string | null;
  position: string | null;
  country: string | null;
  academic_title: string | null;
  available_for_collaboration: boolean | null;
  collaboration_description: string | null;
  profile_visibility: string | null;
}

export function useAcademicProfile(targetUserId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = targetUserId || user?.id;
  const isOwner = !targetUserId || targetUserId === user?.id;

  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [credentials, setCredentials] = useState<AcademicCredential[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [interests, setInterests] = useState<ResearchInterest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [profileRes, credRes, pubRes, intRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).single(),
      supabase.from("academic_credentials").select("*").eq("user_id", userId).order("year_of_graduation", { ascending: false }),
      supabase.from("publications").select("*").eq("user_id", userId).order("year", { ascending: false }),
      supabase.from("research_interests").select("*").eq("user_id", userId).order("name"),
    ]);
    if (profileRes.data) setProfile(profileRes.data as unknown as ExtendedProfile);
    if (credRes.data) setCredentials(credRes.data as AcademicCredential[]);
    if (pubRes.data) setPublications(pubRes.data as Publication[]);
    if (intRes.data) setInterests(intRes.data as ResearchInterest[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Profile update
  const updateProfile = async (updates: Partial<ExtendedProfile>) => {
    if (!userId) return;
    const { error } = await supabase.from("profiles").update(updates as any).eq("user_id", userId);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return false; }
    toast({ title: "Profile updated" });
    await fetchAll();
    return true;
  };

  // Credentials CRUD
  const addCredential = async (cred: Omit<AcademicCredential, "id" | "user_id">) => {
    if (!userId) return;
    const { error } = await supabase.from("academic_credentials").insert({ ...cred, user_id: userId } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Credential added" });
    await fetchAll();
  };

  const deleteCredential = async (id: string) => {
    const { error } = await supabase.from("academic_credentials").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Credential removed" });
    await fetchAll();
  };

  // Publications CRUD
  const addPublication = async (pub: Omit<Publication, "id" | "user_id">) => {
    if (!userId) return;
    const { error } = await supabase.from("publications").insert({ ...pub, user_id: userId } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Publication added" });
    await fetchAll();
  };

  const deletePublication = async (id: string) => {
    const { error } = await supabase.from("publications").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Publication removed" });
    await fetchAll();
  };

  // Research interests
  const addInterest = async (name: string) => {
    if (!userId) return;
    const { error } = await supabase.from("research_interests").insert({ user_id: userId, name } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    await fetchAll();
  };

  const removeInterest = async (id: string) => {
    const { error } = await supabase.from("research_interests").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    await fetchAll();
  };

  // Profile completeness
  const completeness = (() => {
    if (!profile) return 0;
    const checks = [
      !!profile.bio,
      !!profile.institution,
      !!profile.country,
      !!profile.academic_title,
      !!profile.department,
      credentials.length > 0,
      publications.length > 0,
      interests.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  })();

  return {
    profile, credentials, publications, interests, loading, isOwner, completeness,
    updateProfile, addCredential, deleteCredential, addPublication, deletePublication,
    addInterest, removeInterest, refetch: fetchAll,
  };
}
