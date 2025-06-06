export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      action_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          ip_address: unknown | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
        }
        Relationships: []
      }
      civil_defense_alerts: {
        Row: {
          affected_areas: string[]
          alert_type: Database["public"]["Enums"]["alert_type"]
          coordinates: Json | null
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          message: string
          severity: Database["public"]["Enums"]["alert_severity"]
          status: Database["public"]["Enums"]["alert_status"]
          title: string
          updated_at: string
        }
        Insert: {
          affected_areas?: string[]
          alert_type: Database["public"]["Enums"]["alert_type"]
          coordinates?: Json | null
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          message: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          title: string
          updated_at?: string
        }
        Update: {
          affected_areas?: string[]
          alert_type?: Database["public"]["Enums"]["alert_type"]
          coordinates?: Json | null
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          message?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      civil_defense_users: {
        Row: {
          created_at: string
          department: string | null
          id: string
          is_active: boolean | null
          permissions: string[] | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: string[] | null
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          is_active?: boolean | null
          permissions?: string[] | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      flood_alerts: {
        Row: {
          affected_areas: string[] | null
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          latitude: number
          longitude: number
          message: string
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          affected_areas?: string[] | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          latitude: number
          longitude: number
          message: string
          severity: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          affected_areas?: string[] | null
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          message?: string
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      flood_reports: {
        Row: {
          address: string | null
          approved: boolean | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          message: string
          neighborhood: string
          report_date: string
          severity: string
          updated_at: string
          user_id: string | null
          user_ip: unknown | null
        }
        Insert: {
          address?: string | null
          approved?: boolean | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          message: string
          neighborhood: string
          report_date?: string
          severity: string
          updated_at?: string
          user_id?: string | null
          user_ip?: unknown | null
        }
        Update: {
          address?: string | null
          approved?: boolean | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          message?: string
          neighborhood?: string
          report_date?: string
          severity?: string
          updated_at?: string
          user_id?: string | null
          user_ip?: unknown | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          neighborhood: string | null
          notification_preferences: Json | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          neighborhood?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          neighborhood?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_civil_defense_user: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      alert_severity: "low" | "moderate" | "high" | "critical"
      alert_status: "draft" | "active" | "expired" | "cancelled"
      alert_type:
        | "flood"
        | "storm"
        | "landslide"
        | "severe_weather"
        | "evacuation"
        | "all_clear"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["low", "moderate", "high", "critical"],
      alert_status: ["draft", "active", "expired", "cancelled"],
      alert_type: [
        "flood",
        "storm",
        "landslide",
        "severe_weather",
        "evacuation",
        "all_clear",
      ],
    },
  },
} as const
