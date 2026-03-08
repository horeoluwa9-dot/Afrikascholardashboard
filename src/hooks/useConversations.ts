import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ConversationParticipant {
  user_id: string;
  status: string;
  profile?: {
    display_name: string | null;
    institution: string | null;
    discipline: string | null;
    avatar_url: string | null;
  };
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface ConversationWithDetails {
  id: string;
  updated_at: string;
  participants: ConversationParticipant[];
  last_message?: MessageRow;
  unread_count: number;
  status: string; // 'accepted' | 'pending' | 'ignored' from current user's perspective
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Get all conversation IDs for current user
    const { data: participations } = await supabase
      .from("conversation_participants")
      .select("conversation_id, status")
      .eq("user_id", user.id);

    if (!participations || participations.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    const convIds = participations.map((p) => p.conversation_id);
    const statusMap = Object.fromEntries(participations.map((p) => [p.conversation_id, p.status]));

    // Fetch conversations
    const { data: convos } = await supabase
      .from("conversations")
      .select("*")
      .in("id", convIds)
      .order("updated_at", { ascending: false });

    // Fetch all participants for these conversations
    const { data: allParticipants } = await supabase
      .from("conversation_participants")
      .select("conversation_id, user_id, status")
      .in("conversation_id", convIds);

    // Fetch profiles for all participants
    const participantUserIds = [...new Set((allParticipants || []).map((p) => p.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, display_name, institution, discipline, avatar_url")
      .in("user_id", participantUserIds);

    const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));

    // Fetch last message for each conversation
    const lastMessages: Record<string, MessageRow> = {};
    for (const convId of convIds) {
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: false })
        .limit(1);
      if (msgs && msgs.length > 0) lastMessages[convId] = msgs[0] as MessageRow;
    }

    // Fetch unread counts
    const unreadCounts: Record<string, number> = {};
    for (const convId of convIds) {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", convId)
        .neq("sender_id", user.id)
        .is("read_at", null);
      unreadCounts[convId] = count || 0;
    }

    const result: ConversationWithDetails[] = (convos || []).map((c) => ({
      id: c.id,
      updated_at: c.updated_at,
      participants: (allParticipants || [])
        .filter((p) => p.conversation_id === c.id)
        .map((p) => ({
          user_id: p.user_id,
          status: p.status,
          profile: profileMap[p.user_id],
        })),
      last_message: lastMessages[c.id],
      unread_count: unreadCounts[c.id] || 0,
      status: statusMap[c.id] || "pending",
    }));

    setConversations(result);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("messages-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, fetchConversations]);

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user) return;
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    });
  };

  const acceptRequest = async (conversationId: string) => {
    if (!user) return;
    await supabase
      .from("conversation_participants")
      .update({ status: "accepted" })
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);
    fetchConversations();
  };

  const ignoreRequest = async (conversationId: string) => {
    if (!user) return;
    await supabase
      .from("conversation_participants")
      .update({ status: "ignored" })
      .eq("conversation_id", conversationId)
      .eq("user_id", user.id);
    fetchConversations();
  };

  const startConversation = async (otherUserId: string, initialMessage: string) => {
    if (!user) return;

    // Check if conversation already exists between these two users
    const { data: myConvos } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (myConvos && myConvos.length > 0) {
      const myConvIds = myConvos.map((c) => c.conversation_id);
      const { data: existing } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", otherUserId)
        .in("conversation_id", myConvIds);

      if (existing && existing.length > 0) {
        // Conversation exists, just send message
        await sendMessage(existing[0].conversation_id, initialMessage);
        return existing[0].conversation_id;
      }
    }

    // Create new conversation
    const { data: newConvo } = await supabase
      .from("conversations")
      .insert({})
      .select()
      .single();

    if (!newConvo) return null;

    // Add both participants - initiator is accepted, receiver is pending
    await supabase.from("conversation_participants").insert([
      { conversation_id: newConvo.id, user_id: user.id, status: "accepted" },
      { conversation_id: newConvo.id, user_id: otherUserId, status: "pending" },
    ]);

    // Send initial message
    await sendMessage(newConvo.id, initialMessage);
    fetchConversations();
    return newConvo.id;
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) return;
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user.id)
      .is("read_at", null);
  };

  return {
    conversations,
    loading,
    sendMessage,
    acceptRequest,
    ignoreRequest,
    startConversation,
    markAsRead,
    refetch: fetchConversations,
  };
}
