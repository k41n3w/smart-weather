export type ProfileType = "athlete" | "driver" | "farmer" | "tourist" | "student"

export interface UserProfile {
  id: string
  name: string
  email: string
  city: string
  country: string
  profile_type: ProfileType
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  user_id: string
  temperature_unit: "C" | "F"
  theme: "light" | "dark" | "system"
  notifications_enabled: boolean
  created_at: string
  updated_at: string
}

export interface UserLocation {
  id: string
  user_id: string
  city: string
  country: string
  latitude: number | null
  longitude: number | null
  is_default: boolean
  created_at: string
}
