export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      blocked_profiles: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          profile_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          profile_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blocked_profiles_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blocked_profiles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "approved_matrimonial_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blocked_profiles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "matrimonial_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_requests: {
        Row: {
          created_at: string;
          from_user_id: string;
          id: string;
          message: string | null;
          status: string;
          to_profile_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          from_user_id: string;
          id?: string;
          message?: string | null;
          status?: string;
          to_profile_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          from_user_id?: string;
          id?: string;
          message?: string | null;
          status?: string;
          to_profile_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "contact_requests_from_user_id_fkey";
            columns: ["from_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contact_requests_to_profile_id_fkey";
            columns: ["to_profile_id"];
            isOneToOne: false;
            referencedRelation: "approved_matrimonial_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "contact_requests_to_profile_id_fkey";
            columns: ["to_profile_id"];
            isOneToOne: false;
            referencedRelation: "matrimonial_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      interests: {
        Row: {
          created_at: string;
          from_user_id: string;
          id: string;
          message: string | null;
          status: string;
          to_profile_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          from_user_id: string;
          id?: string;
          message?: string | null;
          status?: string;
          to_profile_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          from_user_id?: string;
          id?: string;
          message?: string | null;
          status?: string;
          to_profile_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "interests_from_user_id_fkey";
            columns: ["from_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "interests_to_profile_id_fkey";
            columns: ["to_profile_id"];
            isOneToOne: false;
            referencedRelation: "approved_matrimonial_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "interests_to_profile_id_fkey";
            columns: ["to_profile_id"];
            isOneToOne: false;
            referencedRelation: "matrimonial_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      matrimonial_profiles: {
        Row: {
          age: number;
          city: string | null;
          community: string;
          created_at: string;
          display_name: string;
          education: string | null;
          family_summary: string | null;
          gender: string;
          height_cm: number | null;
          id: string;
          languages: string[];
          marital_status: string;
          moderation_status: string;
          mother_tongue: string;
          native_place: string | null;
          occupation: string | null;
          owner_id: string;
          photo_visibility: string;
          profile_code: string;
          state: string | null;
          updated_at: string;
          visibility: string;
        };
        Insert: {
          age: number;
          city?: string | null;
          community?: string;
          created_at?: string;
          display_name: string;
          education?: string | null;
          family_summary?: string | null;
          gender: string;
          height_cm?: number | null;
          id?: string;
          languages?: string[];
          marital_status?: string;
          moderation_status?: string;
          mother_tongue?: string;
          native_place?: string | null;
          occupation?: string | null;
          owner_id: string;
          photo_visibility?: string;
          profile_code?: string;
          state?: string | null;
          updated_at?: string;
          visibility?: string;
        };
        Update: {
          age?: number;
          city?: string | null;
          community?: string;
          created_at?: string;
          display_name?: string;
          education?: string | null;
          family_summary?: string | null;
          gender?: string;
          height_cm?: number | null;
          id?: string;
          languages?: string[];
          marital_status?: string;
          moderation_status?: string;
          mother_tongue?: string;
          native_place?: string | null;
          occupation?: string | null;
          owner_id?: string;
          photo_visibility?: string;
          profile_code?: string;
          state?: string | null;
          updated_at?: string;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matrimonial_profiles_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      membership_plans: {
        Row: {
          active: boolean;
          benefits: Json;
          created_at: string;
          description: string;
          duration_days: number | null;
          id: string;
          name: string;
          price_paise: number | null;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          benefits?: Json;
          created_at?: string;
          description?: string;
          duration_days?: number | null;
          id?: string;
          name: string;
          price_paise?: number | null;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          benefits?: Json;
          created_at?: string;
          description?: string;
          duration_days?: number | null;
          id?: string;
          name?: string;
          price_paise?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      memberships: {
        Row: {
          created_at: string;
          expires_at: string | null;
          id: string;
          owner_id: string;
          plan_id: string | null;
          starts_at: string | null;
          status: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          owner_id: string;
          plan_id?: string | null;
          starts_at?: string | null;
          status?: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          owner_id?: string;
          plan_id?: string | null;
          starts_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memberships_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "memberships_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "membership_plans";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          message: string;
          owner_id: string;
          read_at: string | null;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          message: string;
          owner_id: string;
          read_at?: string | null;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string;
          owner_id?: string;
          read_at?: string | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      partner_preferences: {
        Row: {
          created_at: string;
          education: string | null;
          id: string;
          marital_statuses: string[];
          max_age: number | null;
          max_height_cm: number | null;
          min_age: number | null;
          min_height_cm: number | null;
          occupation: string | null;
          other_preferences: string | null;
          owner_id: string;
          preferred_locations: string[];
          profile_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          education?: string | null;
          id?: string;
          marital_statuses?: string[];
          max_age?: number | null;
          max_height_cm?: number | null;
          min_age?: number | null;
          min_height_cm?: number | null;
          occupation?: string | null;
          other_preferences?: string | null;
          owner_id: string;
          preferred_locations?: string[];
          profile_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          education?: string | null;
          id?: string;
          marital_statuses?: string[];
          max_age?: number | null;
          max_height_cm?: number | null;
          min_age?: number | null;
          min_height_cm?: number | null;
          occupation?: string | null;
          other_preferences?: string | null;
          owner_id?: string;
          preferred_locations?: string[];
          profile_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "partner_preferences_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partner_preferences_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "approved_matrimonial_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partner_preferences_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "matrimonial_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount_paise: number;
          created_at: string;
          currency: string;
          gateway_payment_id: string | null;
          id: string;
          membership_id: string | null;
          order_id: string | null;
          owner_id: string;
          status: string;
        };
        Insert: {
          amount_paise: number;
          created_at?: string;
          currency?: string;
          gateway_payment_id?: string | null;
          id?: string;
          membership_id?: string | null;
          order_id?: string | null;
          owner_id: string;
          status?: string;
        };
        Update: {
          amount_paise?: number;
          created_at?: string;
          currency?: string;
          gateway_payment_id?: string | null;
          id?: string;
          membership_id?: string | null;
          order_id?: string | null;
          owner_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_membership_id_fkey";
            columns: ["membership_id"];
            isOneToOne: false;
            referencedRelation: "memberships";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profile_photos: {
        Row: {
          consented: boolean;
          created_at: string;
          id: string;
          is_primary: boolean;
          owner_id: string;
          profile_id: string;
          storage_path: string;
        };
        Insert: {
          consented?: boolean;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          owner_id: string;
          profile_id: string;
          storage_path: string;
        };
        Update: {
          consented?: boolean;
          created_at?: string;
          id?: string;
          is_primary?: boolean;
          owner_id?: string;
          profile_id?: string;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_photos_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_photos_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "approved_matrimonial_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_photos_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "matrimonial_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profile_private_details: {
        Row: {
          annual_income: string | null;
          created_at: string;
          date_of_birth: string | null;
          email: string | null;
          employer_details: string | null;
          family_description: string | null;
          family_location: string | null;
          family_type: string | null;
          father_occupation: string | null;
          mother_occupation: string | null;
          native_place: string | null;
          owner_id: string;
          phone_visibility: string;
          profile_id: string;
          siblings_count: number | null;
          updated_at: string;
        };
        Insert: {
          annual_income?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          employer_details?: string | null;
          family_description?: string | null;
          family_location?: string | null;
          family_type?: string | null;
          father_occupation?: string | null;
          mother_occupation?: string | null;
          native_place?: string | null;
          owner_id: string;
          phone_visibility?: string;
          profile_id: string;
          siblings_count?: number | null;
          updated_at?: string;
        };
        Update: {
          annual_income?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          employer_details?: string | null;
          family_description?: string | null;
          family_location?: string | null;
          family_type?: string | null;
          father_occupation?: string | null;
          mother_occupation?: string | null;
          native_place?: string | null;
          owner_id?: string;
          phone_visibility?: string;
          profile_id?: string;
          siblings_count?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_private_details_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_private_details_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "approved_matrimonial_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_private_details_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: true;
            referencedRelation: "matrimonial_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profile_reports: {
        Row: {
          created_at: string;
          id: string;
          profile_id: string;
          reason: string;
          reporter_id: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          profile_id: string;
          reason: string;
          reporter_id: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          profile_id?: string;
          reason?: string;
          reporter_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profile_reports_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "approved_matrimonial_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_reports_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "matrimonial_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profile_reports_reporter_id_fkey";
            columns: ["reporter_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          account_type: string;
          created_at: string;
          full_name: string;
          gender: string | null;
          id: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          account_type?: string;
          created_at?: string;
          full_name?: string;
          gender?: string | null;
          id: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          account_type?: string;
          created_at?: string;
          full_name?: string;
          gender?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      shortlisted_profiles: {
        Row: {
          created_at: string;
          id: string;
          owner_id: string;
          profile_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          owner_id: string;
          profile_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          owner_id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shortlisted_profiles_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shortlisted_profiles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "approved_matrimonial_profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shortlisted_profiles_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "matrimonial_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      support_requests: {
        Row: {
          created_at: string;
          id: string;
          message: string;
          owner_id: string;
          status: string;
          subject: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          message: string;
          owner_id: string;
          status?: string;
          subject: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          message?: string;
          owner_id?: string;
          status?: string;
          subject?: string;
        };
        Relationships: [
          {
            foreignKeyName: "support_requests_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      approved_matrimonial_profiles: {
        Row: {
          age: number | null;
          city: string | null;
          community: string | null;
          created_at: string | null;
          display_name: string | null;
          education: string | null;
          family_summary: string | null;
          gender: string | null;
          height_cm: number | null;
          id: string | null;
          languages: string[] | null;
          marital_status: string | null;
          mother_tongue: string | null;
          native_place: string | null;
          occupation: string | null;
          photo_visibility: string | null;
          profile_code: string | null;
          state: string | null;
        };
        Insert: {
          age?: number | null;
          city?: string | null;
          community?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          education?: string | null;
          family_summary?: string | null;
          gender?: string | null;
          height_cm?: number | null;
          id?: string | null;
          languages?: string[] | null;
          marital_status?: string | null;
          mother_tongue?: string | null;
          native_place?: string | null;
          occupation?: string | null;
          photo_visibility?: string | null;
          profile_code?: string | null;
          state?: string | null;
        };
        Update: {
          age?: number | null;
          city?: string | null;
          community?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          education?: string | null;
          family_summary?: string | null;
          gender?: string | null;
          height_cm?: number | null;
          id?: string | null;
          languages?: string[] | null;
          marital_status?: string | null;
          mother_tongue?: string | null;
          native_place?: string | null;
          occupation?: string | null;
          photo_visibility?: string | null;
          profile_code?: string | null;
          state?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_staff: {
        Args: {
          _user_id: string;
        };
        Returns: boolean;
      };
      profile_photo_status: {
        Args: {
          p_profile_id: string;
        };
        Returns: {
          has_photos: boolean;
          photo_visibility: string;
        }[];
      };
      viewer_can_open_photos: {
        Args: {
          p_profile_id: string;
        };
        Returns: boolean;
      };
      activate_free_membership: {
        Args: {
          p_plan_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const;
