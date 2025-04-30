export interface Recommendation {
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
