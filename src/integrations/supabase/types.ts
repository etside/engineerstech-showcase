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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_recommendations_log: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          intent: string | null
          position: number | null
          score: number | null
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          intent?: string | null
          position?: number | null
          score?: number | null
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          intent?: string | null
          position?: number | null
          score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_recommendations_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      api_keys: {
        Row: {
          business_id: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          key: string
          last_used: string | null
          name: string | null
          permissions: string[]
          rate_limit: number
        }
        Insert: {
          business_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key: string
          last_used?: string | null
          name?: string | null
          permissions?: string[]
          rate_limit?: number
        }
        Update: {
          business_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          key?: string
          last_used?: string | null
          name?: string | null
          permissions?: string[]
          rate_limit?: number
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_claims: {
        Row: {
          additional_docs_requested: string | null
          business_id: string
          claim_type: string
          created_at: string
          evidence: string | null
          evidence_docs: string[] | null
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_docs_requested?: string | null
          business_id: string
          claim_type?: string
          created_at?: string
          evidence?: string | null
          evidence_docs?: string[] | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_docs_requested?: string | null
          business_id?: string
          claim_type?: string
          created_at?: string
          evidence?: string | null
          evidence_docs?: string[] | null
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_claims_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          ai_summary: Json | null
          ai_summary_updated_at: string | null
          category: string
          claimed_by: string | null
          country: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          email: string | null
          employee_count: string | null
          founded_year: number | null
          geo_score: number | null
          hourly_rate: string | null
          id: string
          industry: string | null
          is_active: boolean
          is_featured: boolean | null
          is_verified: boolean | null
          location: string | null
          logo_url: string | null
          min_project_size: string | null
          name: string
          owner_id: string | null
          phone: string | null
          rating: number | null
          review_count: number | null
          search_vector: unknown
          services: string[] | null
          slug: string
          tagline: string | null
          tier: string
          updated_at: string
          verification_docs: string[] | null
          verification_status: string
          website: string | null
        }
        Insert: {
          ai_summary?: Json | null
          ai_summary_updated_at?: string | null
          category: string
          claimed_by?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count?: string | null
          founded_year?: number | null
          geo_score?: number | null
          hourly_rate?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          is_featured?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          logo_url?: string | null
          min_project_size?: string | null
          name: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          search_vector?: unknown
          services?: string[] | null
          slug: string
          tagline?: string | null
          tier?: string
          updated_at?: string
          verification_docs?: string[] | null
          verification_status?: string
          website?: string | null
        }
        Update: {
          ai_summary?: Json | null
          ai_summary_updated_at?: string | null
          category?: string
          claimed_by?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          employee_count?: string | null
          founded_year?: number | null
          geo_score?: number | null
          hourly_rate?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean
          is_featured?: boolean | null
          is_verified?: boolean | null
          location?: string | null
          logo_url?: string | null
          min_project_size?: string | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          search_vector?: unknown
          services?: string[] | null
          slug?: string
          tagline?: string | null
          tier?: string
          updated_at?: string
          verification_docs?: string[] | null
          verification_status?: string
          website?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      claim_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string
          business_id: string
          claim_id: string
          created_at: string
          id: string
          metadata: Json | null
          notes: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string
          business_id: string
          claim_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string
          business_id?: string
          claim_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_audit_log_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claim_audit_log_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "business_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      geo_feed_cache: {
        Row: {
          cache_key: string
          expires_at: string
          generated_at: string
          id: string
          payload: Json
        }
        Insert: {
          cache_key: string
          expires_at?: string
          generated_at?: string
          id?: string
          payload: Json
        }
        Update: {
          cache_key?: string
          expires_at?: string
          generated_at?: string
          id?: string
          payload?: Json
        }
        Relationships: []
      }
      mcp_config: {
        Row: {
          allow_write: boolean
          api_token: string
          created_at: string
          enabled: boolean
          id: string
          server_name: string
          updated_at: string
        }
        Insert: {
          allow_write?: boolean
          api_token: string
          created_at?: string
          enabled?: boolean
          id?: string
          server_name?: string
          updated_at?: string
        }
        Update: {
          allow_write?: boolean
          api_token?: string
          created_at?: string
          enabled?: boolean
          id?: string
          server_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      mcp_configs: {
        Row: {
          blacklisted_llms: string[]
          business_id: string
          context_window: number
          custom_prompt: string | null
          expose_fields: string[]
          id: string
          include_logo: boolean
          is_active: boolean
          updated_at: string
          whitelisted_llms: string[]
        }
        Insert: {
          blacklisted_llms?: string[]
          business_id: string
          context_window?: number
          custom_prompt?: string | null
          expose_fields?: string[]
          id?: string
          include_logo?: boolean
          is_active?: boolean
          updated_at?: string
          whitelisted_llms?: string[]
        }
        Update: {
          blacklisted_llms?: string[]
          business_id?: string
          context_window?: number
          custom_prompt?: string | null
          expose_fields?: string[]
          id?: string
          include_logo?: boolean
          is_active?: boolean
          updated_at?: string
          whitelisted_llms?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "mcp_configs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          description: string | null
          is_secret: boolean
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          is_secret?: boolean
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          is_secret?: boolean
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      pricing_tiers: {
        Row: {
          billing_period: string
          created_at: string
          display_order: number
          features: Json
          id: string
          is_active: boolean
          limits: Json
          name: string
          price_bdt: number | null
          price_usd: number
          slug: string
          updated_at: string
        }
        Insert: {
          billing_period?: string
          created_at?: string
          display_order?: number
          features?: Json
          id?: string
          is_active?: boolean
          limits?: Json
          name: string
          price_bdt?: number | null
          price_usd?: number
          slug: string
          updated_at?: string
        }
        Update: {
          billing_period?: string
          created_at?: string
          display_order?: number
          features?: Json
          id?: string
          is_active?: boolean
          limits?: Json
          name?: string
          price_bdt?: number | null
          price_usd?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          full_name: string | null
          headline: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          headline?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          full_name?: string | null
          headline?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_id: string
          body: string | null
          business_id: string
          created_at: string
          helpful_count: number
          id: string
          rating: number
          status: string
          title: string | null
          updated_at: string
          verified: boolean
        }
        Insert: {
          author_id: string
          body?: string | null
          business_id: string
          created_at?: string
          helpful_count?: number
          id?: string
          rating: number
          status?: string
          title?: string | null
          updated_at?: string
          verified?: boolean
        }
        Update: {
          author_id?: string
          body?: string | null
          business_id?: string
          created_at?: string
          helpful_count?: number
          id?: string
          rating?: number
          status?: string
          title?: string | null
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          auto_renew: boolean
          business_id: string
          created_at: string
          currency: string
          id: string
          raw_payload: Json | null
          sslcz_tran_id: string | null
          sslcz_val_id: string | null
          status: string
          tier: string
          updated_at: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          amount?: number | null
          auto_renew?: boolean
          business_id: string
          created_at?: string
          currency?: string
          id?: string
          raw_payload?: Json | null
          sslcz_tran_id?: string | null
          sslcz_val_id?: string | null
          status?: string
          tier: string
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          amount?: number | null
          auto_renew?: boolean
          business_id?: string
          created_at?: string
          currency?: string
          id?: string
          raw_payload?: Json | null
          sslcz_tran_id?: string | null
          sslcz_val_id?: string | null
          status?: string
          tier?: string
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      refresh_business_active: {
        Args: { _business_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "business_owner" | "user" | "super_admin"
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
      app_role: ["admin", "business_owner", "user", "super_admin"],
    },
  },
} as const
