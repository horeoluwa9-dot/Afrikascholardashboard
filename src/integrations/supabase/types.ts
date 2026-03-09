export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      academic_connections: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          requester_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          requester_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: string
        }
        Relationships: []
      }
      academic_credentials: {
        Row: {
          created_at: string
          degree: string
          field_of_study: string
          id: string
          university: string
          user_id: string
          year_of_graduation: number | null
        }
        Insert: {
          created_at?: string
          degree: string
          field_of_study: string
          id?: string
          university: string
          user_id: string
          year_of_graduation?: number | null
        }
        Update: {
          created_at?: string
          degree?: string
          field_of_study?: string
          id?: string
          university?: string
          user_id?: string
          year_of_graduation?: number | null
        }
        Relationships: []
      }
      advisory_profiles: {
        Row: {
          created_at: string
          hourly_rate: string | null
          id: string
          is_available: boolean | null
          services: string[] | null
          specialization: string
          user_id: string
        }
        Insert: {
          created_at?: string
          hourly_rate?: string | null
          id?: string
          is_available?: boolean | null
          services?: string[] | null
          specialization: string
          user_id: string
        }
        Update: {
          created_at?: string
          hourly_rate?: string | null
          id?: string
          is_available?: boolean | null
          services?: string[] | null
          specialization?: string
          user_id?: string
        }
        Relationships: []
      }
      advisory_requests: {
        Row: {
          advisor_id: string
          created_at: string
          description: string | null
          expected_duration: string | null
          id: string
          institution: string | null
          requester_id: string
          status: string
          topic: string
        }
        Insert: {
          advisor_id: string
          created_at?: string
          description?: string | null
          expected_duration?: string | null
          id?: string
          institution?: string | null
          requester_id: string
          status?: string
          topic: string
        }
        Update: {
          advisor_id?: string
          created_at?: string
          description?: string | null
          expected_duration?: string | null
          id?: string
          institution?: string | null
          requester_id?: string
          status?: string
          topic?: string
        }
        Relationships: []
      }
      ai_papers: {
        Row: {
          citation_style: string
          content: Json
          created_at: string
          credits_used: number
          id: string
          paper_type: string
          research_field: string | null
          sections: Json
          sources: Json
          status: string
          target_journal: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          citation_style?: string
          content?: Json
          created_at?: string
          credits_used?: number
          id?: string
          paper_type?: string
          research_field?: string | null
          sections?: Json
          sources?: Json
          status?: string
          target_journal?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          citation_style?: string
          content?: Json
          created_at?: string
          credits_used?: number
          id?: string
          paper_type?: string
          research_field?: string | null
          sections?: Json
          sources?: Json
          status?: string
          target_journal?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          status: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          status?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      download_history: {
        Row: {
          downloaded_at: string
          file_type: string
          id: string
          journal: string | null
          title: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string
          file_type?: string
          id?: string
          journal?: string | null
          title: string
          user_id: string
        }
        Update: {
          downloaded_at?: string
          file_type?: string
          id?: string
          journal?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      editorial_board_members: {
        Row: {
          added_at: string
          display_name: string | null
          id: string
          institution: string | null
          journal_id: string
          role: string
          user_id: string
        }
        Insert: {
          added_at?: string
          display_name?: string | null
          id?: string
          institution?: string | null
          journal_id: string
          role?: string
          user_id: string
        }
        Update: {
          added_at?: string
          display_name?: string | null
          id?: string
          institution?: string | null
          journal_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_board_members_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
        ]
      }
      engagements: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          engagement_type: string
          id: string
          institution: string | null
          start_date: string | null
          status: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          engagement_type?: string
          id?: string
          institution?: string | null
          start_date?: string | null
          status?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          engagement_type?: string
          id?: string
          institution?: string | null
          start_date?: string | null
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_letter_url: string | null
          created_at: string
          cv_url: string | null
          id: string
          job_id: string
          research_statement: string | null
          status: string
          user_id: string
        }
        Insert: {
          cover_letter_url?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          job_id: string
          research_statement?: string | null
          status?: string
          user_id: string
        }
        Update: {
          cover_letter_url?: string | null
          created_at?: string
          cv_url?: string | null
          id?: string
          job_id?: string
          research_statement?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      job_opportunities: {
        Row: {
          application_deadline: string | null
          created_at: string
          description: string | null
          id: string
          institution: string
          job_type: string | null
          location: string | null
          posted_by: string | null
          requirements: string | null
          title: string
        }
        Insert: {
          application_deadline?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institution: string
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          requirements?: string | null
          title: string
        }
        Update: {
          application_deadline?: string | null
          created_at?: string
          description?: string | null
          id?: string
          institution?: string
          job_type?: string | null
          location?: string | null
          posted_by?: string | null
          requirements?: string | null
          title?: string
        }
        Relationships: []
      }
      journal_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string
          currency: string
          expires_at: string | null
          id: string
          journal_id: string | null
          journal_name: string
          payment_reference: string | null
          plan_type: string
          price_amount: number
          publisher: string | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          journal_id?: string | null
          journal_name: string
          payment_reference?: string | null
          plan_type?: string
          price_amount?: number
          publisher?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string
          currency?: string
          expires_at?: string | null
          id?: string
          journal_id?: string | null
          journal_name?: string
          payment_reference?: string | null
          plan_type?: string
          price_amount?: number
          publisher?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_subscriptions_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
        ]
      }
      journals: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          issn: string | null
          name: string
          publisher: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          issn?: string | null
          name: string
          publisher?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          issn?: string | null
          name?: string
          publisher?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      manuscript_submissions: {
        Row: {
          abstract: string | null
          co_authors: Json | null
          cover_letter: string | null
          id: string
          journal_id: string | null
          journal_name: string
          keywords: string | null
          manuscript_url: string | null
          research_field: string | null
          reviewer_feedback: Json | null
          status: string
          submitted_at: string
          title: string
          updated_at: string
          user_id: string
          workflow_stage: string
        }
        Insert: {
          abstract?: string | null
          co_authors?: Json | null
          cover_letter?: string | null
          id?: string
          journal_id?: string | null
          journal_name: string
          keywords?: string | null
          manuscript_url?: string | null
          research_field?: string | null
          reviewer_feedback?: Json | null
          status?: string
          submitted_at?: string
          title: string
          updated_at?: string
          user_id: string
          workflow_stage?: string
        }
        Update: {
          abstract?: string | null
          co_authors?: Json | null
          cover_letter?: string | null
          id?: string
          journal_id?: string | null
          journal_name?: string
          keywords?: string | null
          manuscript_url?: string | null
          research_field?: string | null
          reviewer_feedback?: Json | null
          status?: string
          submitted_at?: string
          title?: string
          updated_at?: string
          user_id?: string
          workflow_stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "manuscript_submissions_journal_id_fkey"
            columns: ["journal_id"]
            isOneToOne: false
            referencedRelation: "journals"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          ai_alerts: boolean
          created_at: string
          dashboard_notifications: boolean
          email_notifications: boolean
          id: string
          network_invitations: boolean
          publishing_updates: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_alerts?: boolean
          created_at?: string
          dashboard_notifications?: boolean
          email_notifications?: boolean
          id?: string
          network_invitations?: boolean
          publishing_updates?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_alerts?: boolean
          created_at?: string
          dashboard_notifications?: boolean
          email_notifications?: boolean
          id?: string
          network_invitations?: boolean
          publishing_updates?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          link: string | null
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          link?: string | null
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          academic_title: string | null
          available_for_collaboration: boolean | null
          avatar_url: string | null
          bio: string | null
          collaboration_description: string | null
          country: string | null
          created_at: string
          department: string | null
          discipline: string | null
          display_name: string | null
          id: string
          institution: string | null
          position: string | null
          profile_visibility: string | null
          updated_at: string
          user_id: string
          user_type: string | null
        }
        Insert: {
          academic_title?: string | null
          available_for_collaboration?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          collaboration_description?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          discipline?: string | null
          display_name?: string | null
          id?: string
          institution?: string | null
          position?: string | null
          profile_visibility?: string | null
          updated_at?: string
          user_id: string
          user_type?: string | null
        }
        Update: {
          academic_title?: string | null
          available_for_collaboration?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          collaboration_description?: string | null
          country?: string | null
          created_at?: string
          department?: string | null
          discipline?: string | null
          display_name?: string | null
          id?: string
          institution?: string | null
          position?: string | null
          profile_visibility?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string | null
        }
        Relationships: []
      }
      project_collaborations: {
        Row: {
          created_at: string
          description: string | null
          expected_duration: string | null
          id: string
          partner_institution: string
          research_area: string
          start_date: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expected_duration?: string | null
          id?: string
          partner_institution: string
          research_area: string
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expected_duration?: string | null
          id?: string
          partner_institution?: string
          research_area?: string
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          created_at: string
          id: string
          journal: string | null
          pdf_url: string | null
          status: string
          title: string
          user_id: string
          year: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          journal?: string | null
          pdf_url?: string | null
          status?: string
          title: string
          user_id: string
          year?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          journal?: string | null
          pdf_url?: string | null
          status?: string
          title?: string
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      purchased_papers: {
        Row: {
          access_status: string
          authors: string | null
          id: string
          journal: string | null
          pdf_url: string | null
          purchased_at: string
          title: string
          user_id: string
          year: number | null
        }
        Insert: {
          access_status?: string
          authors?: string | null
          id?: string
          journal?: string | null
          pdf_url?: string | null
          purchased_at?: string
          title: string
          user_id: string
          year?: number | null
        }
        Update: {
          access_status?: string
          authors?: string | null
          id?: string
          journal?: string | null
          pdf_url?: string | null
          purchased_at?: string
          title?: string
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      reading_list_items: {
        Row: {
          added_at: string
          authors: string | null
          id: string
          journal: string | null
          reading_list_id: string
          title: string
          user_id: string
          year: number | null
        }
        Insert: {
          added_at?: string
          authors?: string | null
          id?: string
          journal?: string | null
          reading_list_id: string
          title: string
          user_id: string
          year?: number | null
        }
        Update: {
          added_at?: string
          authors?: string | null
          id?: string
          journal?: string | null
          reading_list_id?: string
          title?: string
          user_id?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_list_items_reading_list_id_fkey"
            columns: ["reading_list_id"]
            isOneToOne: false
            referencedRelation: "reading_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reading_progress: {
        Row: {
          authors: string | null
          created_at: string
          id: string
          journal: string | null
          last_read_at: string
          paper_title: string
          progress_percent: number | null
          source_url: string | null
          user_id: string
        }
        Insert: {
          authors?: string | null
          created_at?: string
          id?: string
          journal?: string | null
          last_read_at?: string
          paper_title: string
          progress_percent?: number | null
          source_url?: string | null
          user_id: string
        }
        Update: {
          authors?: string | null
          created_at?: string
          id?: string
          journal?: string | null
          last_read_at?: string
          paper_title?: string
          progress_percent?: number | null
          source_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      research_interests: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_articles: {
        Row: {
          authors: string | null
          id: string
          journal: string | null
          saved_at: string
          source_url: string | null
          title: string
          user_id: string
          year: number | null
        }
        Insert: {
          authors?: string | null
          id?: string
          journal?: string | null
          saved_at?: string
          source_url?: string | null
          title: string
          user_id: string
          year?: number | null
        }
        Update: {
          authors?: string | null
          id?: string
          journal?: string | null
          saved_at?: string
          source_url?: string | null
          title?: string
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          analysis_credits_total: number
          analysis_credits_used: number
          billing_cycle: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          dataset_credits_total: number
          dataset_credits_used: number
          id: string
          paper_credits_total: number
          paper_credits_used: number
          paystack_reference: string | null
          plan: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_credits_total?: number
          analysis_credits_used?: number
          billing_cycle?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          dataset_credits_total?: number
          dataset_credits_used?: number
          id?: string
          paper_credits_total?: number
          paper_credits_used?: number
          paystack_reference?: string | null
          plan?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_credits_total?: number
          analysis_credits_used?: number
          billing_cycle?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          dataset_credits_total?: number
          dataset_credits_used?: number
          id?: string
          paper_credits_total?: number
          paper_credits_used?: number
          paystack_reference?: string | null
          plan?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      talent_requests: {
        Row: {
          created_at: string
          description: string | null
          expected_duration: string | null
          expertise_area: string
          id: string
          institution_name: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          expected_duration?: string | null
          expertise_area: string
          id?: string
          institution_name: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          expected_duration?: string | null
          expertise_area?: string
          id?: string
          institution_name?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_module_unlocks: {
        Row: {
          id: string
          module: Database["public"]["Enums"]["module_type"]
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: string
          module: Database["public"]["Enums"]["module_type"]
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: string
          module?: Database["public"]["Enums"]["module_type"]
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_module_unlocked: {
        Args: {
          _module: Database["public"]["Enums"]["module_type"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_conversation_participant: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: boolean
      }
      unlock_module: {
        Args: {
          _module: Database["public"]["Enums"]["module_type"]
          _user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "researcher" | "student" | "reviewer" | "institutional_admin"
      module_type:
        | "publishing"
        | "research_intelligence"
        | "publeesh_ai"
        | "instrument_studio"
        | "my_research"
        | "institutional"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["researcher", "student", "reviewer", "institutional_admin"],
      module_type: [
        "publishing",
        "research_intelligence",
        "publeesh_ai",
        "instrument_studio",
        "my_research",
        "institutional",
      ],
    },
  },
} as const
