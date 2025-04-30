"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface Location {
  id: string
  city: string
  country: string
  is_default: boolean
}

export default function LocationList() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newCity, setNewCity] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      fetchLocations()
    }
  }, [user])

  const fetchLocations = async () => {
    if (!user) return

    setIsLoading(true)
    const supabase = getSupabaseClient()

    try {
      const { data, error } = await supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })

      if (error) throw error

      setLocations(data || [])
    } catch (error) {
      console.error("Erro ao buscar localizações:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas localizações.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addLocation = async () => {
    if (!user || !newCity.trim()) return

    setIsSubmitting(true)
    const supabase = getSupabaseClient()

    try {
      // Verificar se já existe uma localização com esta cidade
      const { data: existingData } = await supabase
        .from("user_locations")
        .select("*")
        .eq("user_id", user.id)
        .eq("city", newCity.trim())
        .limit(1)

      if (existingData && existingData.length > 0) {
        toast({
          title: "Cidade já adicionada",
          description: "Esta cidade já está na sua lista de localizações.",
          variant: "destructive",
        })
        return
      }

      // Adicionar nova localização
      const { error } = await supabase.from("user_locations").insert({
        user_id: user.id,
        city: newCity.trim(),
        is_default: locations.length === 0, // Se for a primeira localização, definir como padrão
      })

      if (error) throw error

      toast({
        title: "Localização adicionada",
        description: `${newCity.trim()} foi adicionada à sua lista.`,
      })
    } catch (error) {
      console.error("Erro ao adicionar localização:", error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a localização.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
      setNewCity("")
      setIsSubmitting(false)
      fetchLocations()
    }
  }
}
