import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

type ExtendTable<
  T,
  RowExtension extends Record<string, unknown>,
  InsertExtension extends Record<string, unknown> = RowExtension,
  UpdateExtension extends Record<string, unknown> = Partial<InsertExtension>,
> = Omit<T, "Row" | "Insert" | "Update"> & {
  Row: T extends { Row: infer R } ? R & RowExtension : RowExtension;
  Insert: T extends { Insert: infer I } ? I & Partial<InsertExtension> : Partial<InsertExtension>;
  Update: T extends { Update: infer U } ? U & Partial<UpdateExtension> : Partial<UpdateExtension>;
};

type ProductDatabase = Omit<Database, "public"> & {
  public: Omit<Database["public"], "Tables" | "Views" | "Functions"> & {
    Tables: Omit<
      Database["public"]["Tables"],
      | "matrimonial_profiles"
      | "partner_preferences"
      | "shortlisted_profiles"
      | "interests"
      | "contact_requests"
    > & {
      matrimonial_profiles: ExtendTable<
        Database["public"]["Tables"]["matrimonial_profiles"],
        {
          about_me: string | null;
          citizenship: string | null;
          community_profession: string | null;
          created_for: string;
          food_habit: string | null;
          gothram: string | null;
          has_profile_photo: boolean;
          horoscope_available: boolean | null;
          last_active_at: string | null;
          profile_views_enabled: boolean;
          rashi: string | null;
          star: string | null;
          verified_at: string | null;
        }
      >;
      partner_preferences: ExtendTable<
        Database["public"]["Tables"]["partner_preferences"],
        {
          family_preferences: string | null;
          preferred_citizenship: string | null;
          preferred_community: string | null;
          preferred_food_habit: string | null;
          preferred_gothram: string | null;
          preferred_rashi: string | null;
          preferred_star: string | null;
        }
      >;
      shortlisted_profiles: ExtendTable<
        Database["public"]["Tables"]["shortlisted_profiles"],
        { note: string | null }
      >;
      interests: ExtendTable<
        Database["public"]["Tables"]["interests"],
        { from_profile_id: string | null },
        { from_profile_id?: string | null }
      >;
      contact_requests: ExtendTable<
        Database["public"]["Tables"]["contact_requests"],
        { from_profile_id: string | null },
        { from_profile_id?: string | null }
      >;
      family_details: {
        Row: {
          id: string;
          profile_id: string;
          owner_id: string;
          father_name: string | null;
          father_profession: string | null;
          mother_name: string | null;
          mother_profession: string | null;
          brothers_count: number | null;
          sisters_count: number | null;
          brothers_details: string | null;
          sisters_details: string | null;
          family_type: string | null;
          family_location: string | null;
          family_details: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          owner_id: string;
          father_name?: string | null;
          father_profession?: string | null;
          mother_name?: string | null;
          mother_profession?: string | null;
          brothers_count?: number | null;
          sisters_count?: number | null;
          brothers_details?: string | null;
          sisters_details?: string | null;
          family_type?: string | null;
          family_location?: string | null;
          family_details?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          owner_id?: string;
          father_name?: string | null;
          father_profession?: string | null;
          mother_name?: string | null;
          mother_profession?: string | null;
          brothers_count?: number | null;
          sisters_count?: number | null;
          brothers_details?: string | null;
          sisters_details?: string | null;
          family_type?: string | null;
          family_location?: string | null;
          family_details?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      horoscope_details: {
        Row: {
          id: string;
          profile_id: string;
          owner_id: string;
          horoscope_available: boolean | null;
          star: string | null;
          rashi: string | null;
          gothram: string | null;
          horoscope_file_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          owner_id: string;
          horoscope_available?: boolean | null;
          star?: string | null;
          rashi?: string | null;
          gothram?: string | null;
          horoscope_file_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          owner_id?: string;
          horoscope_available?: boolean | null;
          star?: string | null;
          rashi?: string | null;
          gothram?: string | null;
          horoscope_file_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_searches: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          criteria: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          criteria?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          criteria?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ignored_profiles: {
        Row: { id: string; owner_id: string; profile_id: string; created_at: string };
        Insert: { id?: string; owner_id: string; profile_id: string; created_at?: string };
        Update: { id?: string; owner_id?: string; profile_id?: string; created_at?: string };
        Relationships: [];
      };
      profile_views: {
        Row: {
          id: string;
          viewer_profile_id: string;
          viewed_profile_id: string;
          viewed_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          viewer_profile_id: string;
          viewed_profile_id: string;
          viewed_on?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          viewer_profile_id?: string;
          viewed_profile_id?: string;
          viewed_on?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      success_stories: {
        Row: {
          id: string;
          couple_names: string;
          city: string | null;
          marriage_year: number | null;
          story: string;
          photo_url: string | null;
          permission_confirmed: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          couple_names: string;
          city?: string | null;
          marriage_year?: number | null;
          story: string;
          photo_url?: string | null;
          permission_confirmed?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          couple_names?: string;
          city?: string | null;
          marriage_year?: number | null;
          story?: string;
          photo_url?: string | null;
          permission_confirmed?: boolean;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Omit<Database["public"]["Views"], "approved_matrimonial_profiles"> & {
      approved_matrimonial_profiles: Omit<
        Database["public"]["Views"]["approved_matrimonial_profiles"],
        "Row"
      > & {
        Row: Database["public"]["Views"]["approved_matrimonial_profiles"]["Row"] & {
          about_me: string | null;
          citizenship: string | null;
          community_profession: string | null;
          designation: string | null;
          food_habit: string | null;
          gothram: string | null;
          has_profile_photo: boolean | null;
          horoscope_available: boolean | null;
          last_active_at: string | null;
          place_of_birth: string | null;
          present_location: string | null;
          rashi: string | null;
          smoking_habit: string | null;
          star: string | null;
          time_of_birth: string | null;
          drinking_habit: string | null;
          employment_type: string | null;
          complexion: string | null;
          job_location: string | null;
          verified_at: string | null;
        };
      };
    };
    Functions: Database["public"]["Functions"] & {
      record_profile_view: { Args: { p_viewed_profile_id: string }; Returns: undefined };
      get_accepted_contact_phone: { Args: { p_target_profile_id: string }; Returns: string | null };
    };
  };
};

export const productSupabase = supabase as unknown as SupabaseClient<ProductDatabase>;
