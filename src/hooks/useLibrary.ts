import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface PurchasedPaper {
  id: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  access_status: string;
  pdf_url: string | null;
  purchased_at: string;
}

export interface SavedArticle {
  id: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  source_url: string | null;
  saved_at: string;
}

export interface DownloadRecord {
  id: string;
  title: string;
  journal: string | null;
  file_type: string;
  downloaded_at: string;
}

export interface ReadingList {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  item_count?: number;
}

export interface ReadingListItem {
  id: string;
  reading_list_id: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number | null;
  added_at: string;
}

export function useLibrary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [purchased, setPurchased] = useState<PurchasedPaper[]>([]);
  const [saved, setSaved] = useState<SavedArticle[]>([]);
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [readingLists, setReadingLists] = useState<ReadingList[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [pRes, sRes, dRes, rlRes] = await Promise.all([
      supabase.from("purchased_papers").select("*").eq("user_id", user.id).order("purchased_at", { ascending: false }),
      supabase.from("saved_articles").select("*").eq("user_id", user.id).order("saved_at", { ascending: false }),
      supabase.from("download_history").select("*").eq("user_id", user.id).order("downloaded_at", { ascending: false }),
      supabase.from("reading_lists").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
    ]);
    if (pRes.data) setPurchased(pRes.data as PurchasedPaper[]);
    if (sRes.data) setSaved(sRes.data as SavedArticle[]);
    if (dRes.data) setDownloads(dRes.data as DownloadRecord[]);

    // Get item counts for reading lists
    if (rlRes.data) {
      const lists = rlRes.data as ReadingList[];
      if (lists.length > 0) {
        const countPromises = lists.map(async (list) => {
          const { count } = await supabase
            .from("reading_list_items")
            .select("*", { count: "exact", head: true })
            .eq("reading_list_id", list.id);
          return { ...list, item_count: count || 0 };
        });
        const listsWithCounts = await Promise.all(countPromises);
        setReadingLists(listsWithCounts);
      } else {
        setReadingLists([]);
      }
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Saved articles
  const saveArticle = async (article: Omit<SavedArticle, "id" | "saved_at">) => {
    if (!user) return;
    const { error } = await supabase.from("saved_articles").insert({ ...article, user_id: user.id } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Article saved" });
    await fetchAll();
  };

  const removeSavedArticle = async (id: string) => {
    const { error } = await supabase.from("saved_articles").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Article removed" });
    await fetchAll();
  };

  // Reading lists
  const createReadingList = async (name: string, description?: string) => {
    if (!user) return;
    const { error } = await supabase.from("reading_lists").insert({ user_id: user.id, name, description: description || null } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Reading list created" });
    await fetchAll();
  };

  const deleteReadingList = async (id: string) => {
    const { error } = await supabase.from("reading_lists").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Reading list deleted" });
    await fetchAll();
  };

  const updateReadingList = async (id: string, name: string, description?: string) => {
    const { error } = await supabase.from("reading_lists").update({ name, description: description || null } as any).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Reading list updated" });
    await fetchAll();
  };

  // Reading list items
  const getListItems = async (listId: string): Promise<ReadingListItem[]> => {
    const { data } = await supabase
      .from("reading_list_items")
      .select("*")
      .eq("reading_list_id", listId)
      .order("added_at", { ascending: false });
    return (data as ReadingListItem[]) || [];
  };

  const addToReadingList = async (listId: string, item: { title: string; authors?: string; journal?: string; year?: number }) => {
    if (!user) return;
    const { error } = await supabase.from("reading_list_items").insert({
      reading_list_id: listId,
      user_id: user.id,
      title: item.title,
      authors: item.authors || null,
      journal: item.journal || null,
      year: item.year || null,
    } as any);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Added to reading list" });
    await fetchAll();
  };

  const removeFromReadingList = async (itemId: string) => {
    const { error } = await supabase.from("reading_list_items").delete().eq("id", itemId);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Removed from list" });
    await fetchAll();
  };

  const hasActivity = purchased.length > 0 || saved.length > 0 || downloads.length > 0 || readingLists.length > 0;

  return {
    purchased, saved, downloads, readingLists, loading, hasActivity,
    saveArticle, removeSavedArticle,
    createReadingList, deleteReadingList, updateReadingList,
    getListItems, addToReadingList, removeFromReadingList,
    refetch: fetchAll,
  };
}
