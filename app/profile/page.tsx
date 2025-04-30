"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Bike, Car, Leaf, Umbrella, Book } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/lib/auth-client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import type { ProfileType } from "@/types/user"
import Link from "next/link"
import AuthGuard from "@/components/auth-guard"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  city: z.string().min(2, {
    message: "Por favor, insira uma cidade válida.",
  }),
  profile_type: z.enum(["athlete", "driver", "farmer", "tourist", "student"], {
    required_error: "Por favor, selecione um perfil.",
  }),
})

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientComponentClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      city: "",
      profile_type: undefined as any,
    },
  })

  // Preencher o formulário com os dados do perfil
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        city: profile.city,
        profile_type: profile.profile_type,
      })
    }
  }, [profile, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return

    setIsSaving(true)

    try {
      // Atualizar o perfil do usuário
      const { error } = await supabase
        .schema("smart_weather")
        .from("user_profiles")
        .update({
          name: values.name,
          city: values.city,
          profile_type: values.profile_type as ProfileType,
        })
        .eq("id", user.id)

      if (error) throw error

      // Atualizar a localização padrão
      const { error: locationError } = await supabase
        .schema("smart_weather")
        .from("user_locations")
        .update({
          city: values.city,
        })
        .eq("user_id", user.id)
        .eq("is_default", true)

      if (locationError) {
        // Se não existir uma localização padrão, criar uma
        const { error: insertError } = await supabase.schema("smart_weather").from("user_locations").insert({
          user_id: user.id,
          city: values.city,
          is_default: true,
        })

        if (insertError) throw insertError
      }

      await refreshProfile()

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })

      // Redirecionar para o dashboard após um pequeno atraso
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AuthGuard>
      <div className="container max-w-md py-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para o dashboard</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Seu perfil</CardTitle>
            <CardDescription>Atualize suas informações pessoais e preferências.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua cidade" {...field} />
                      </FormControl>
                      <FormDescription>
                        Usaremos esta informação para mostrar a previsão do tempo local.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profile_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Perfil de usuário</FormLabel>
                      <FormDescription>Selecione o perfil que melhor se adapta às suas necessidades.</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-1 gap-4"
                        >
                          <ProfileOption
                            value="athlete"
                            label="Atleta"
                            description="Recomendações para treinos e atividades ao ar livre"
                            icon={<Bike className="h-5 w-5" />}
                            checked={field.value === "athlete"}
                          />

                          <ProfileOption
                            value="driver"
                            label="Motorista"
                            description="Informações sobre condições das estradas"
                            icon={<Car className="h-5 w-5" />}
                            checked={field.value === "driver"}
                          />

                          <ProfileOption
                            value="farmer"
                            label="Agricultor"
                            description="Insights para atividades agrícolas"
                            icon={<Leaf className="h-5 w-5" />}
                            checked={field.value === "farmer"}
                          />

                          <ProfileOption
                            value="tourist"
                            label="Turista"
                            description="Sugestões de atividades baseadas no clima"
                            icon={<Umbrella className="h-5 w-5" />}
                            checked={field.value === "tourist"}
                          />

                          <ProfileOption
                            value="student"
                            label="Estudante"
                            description="Planejamento de atividades acadêmicas"
                            icon={<Book className="h-5 w-5" />}
                            checked={field.value === "student"}
                          />
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar alterações"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}

interface ProfileOptionProps {
  value: string
  label: string
  description: string
  icon: React.ReactNode
  checked: boolean
}

function ProfileOption({ value, label, description, icon, checked }: ProfileOptionProps) {
  return (
    <div className="relative">
      <RadioGroupItem value={value} id={value} className="peer sr-only" />
      <label
        htmlFor={value}
        className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary ${
          checked ? "border-primary bg-primary/5" : ""
        }`}
      >
        <div className={`bg-primary/10 p-2 rounded-full ${checked ? "text-primary" : ""}`}>{icon}</div>
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </label>
    </div>
  )
}
