export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // Tabelas existentes no schema public
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  smart_weather: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          name: string
          email: string
          city: string
          country: string
          profile_type: "athlete" | "driver" | "farmer" | "tourist" | "student"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          city: string
          country?: string
          profile_type: "athlete" | "driver" | "farmer" | "tourist" | "student"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          city?: string
          country?: string
          profile_type?: "athlete" | "driver" | "farmer" | "tourist" | "student"
          created_at?: string
          updated_at?: string
        }
      }
      user_locations: {
        Row: {
          id: string
          user_id: string
          city: string
          country: string
          latitude: number | null
          longitude: number | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          city: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          city?: string
          country?: string
          latitude?: number | null
          longitude?: number | null
          is_default?: boolean
          created_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          temperature_unit: "C" | "F"
          theme: "light" | "dark" | "system"
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          temperature_unit?: "C" | "F"
          theme?: "light" | "dark" | "system"
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          temperature_unit?: "C" | "F"
          theme?: "light" | "dark" | "system"
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      weather_cache: {
        Row: {
          id: string
          city: string
          country: string
          weather_data: Json
          fetched_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          city: string
          country?: string
          weather_data: Json
          fetched_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          city?: string
          country?: string
          weather_data?: Json
          fetched_at?: string
          expires_at?: string
        }
      }
      recommendations: {
        Row: {
          id: string
          profile_type: string
          weather_condition: string
          temperature_min: number | null
          temperature_max: number | null
          title: string
          description: string
          tips: string[]
          warning: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_type: string
          weather_condition: string
          temperature_min?: number | null
          temperature_max?: number | null
          title: string
          description: string
          tips: string[]
          warning?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_type?: string
          weather_condition?: string
          temperature_min?: number | null
          temperature_max?: number | null
          title?: string
          description?: string
          tips?: string[]
          warning?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
