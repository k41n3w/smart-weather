"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bike, Car, Leaf, Umbrella, Book, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { getSupabaseClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  city: z.string().min(2, {
    message: "Por favor, insira uma cidade válida.",
  }),
  profile: z.enum(["athlete", "driver", "farmer", "tourist", "student"], {
    required_error: "Por favor, selecione um perfil.",
  }),
})

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      city: "",
      profile: undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setDebugInfo(null)

    try {
      // 1. Criar o usuário no auth do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            city: values.city,
            profile_type: values.profile,
          },
        },
      })

      if (authError) {
        setDebugInfo(JSON.stringify(authError, null, 2))
        throw authError
      }

      if (!authData.user) {
        throw new Error("Usuário não foi criado corretamente")
      }

      // 2. Adicionar um pequeno atraso para garantir que o usuário esteja disponível na tabela auth.users
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 3. Chamar a API para criar o perfil do usuário
      try {
        const response = await fetch("/api/register-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: authData.user.id,
            name: values.name,
            email: values.email,
            city: values.city,
            profile_type: values.profile,
          }),
        })

        const responseData = await response.json()

        if (!response.ok) {
          setDebugInfo((prev) => (prev || "") + "\n\nErro API: " + JSON.stringify(responseData, null, 2))
          // Não interromper o fluxo se o perfil falhar
        } else {
          setDebugInfo((prev) => (prev || "") + "\n\nResposta API: " + JSON.stringify(responseData, null, 2))
        }
      } catch (error) {
        setDebugInfo((prev) => (prev || "") + "\n\nErro API: " + JSON.stringify(error, null, 2))
        // Não interromper o fluxo se o perfil falhar
      }

      // Se chegou até aqui, o registro foi bem-sucedido
      toast({
        title: "Conta criada com sucesso!",
        description: "Enviamos um email de confirmação para você.",
      })

      // Redirecionar para a página inicial com um parâmetro para mostrar a modal
      // Usar window.location.href para garantir um redirecionamento completo
      window.location.href = `/?showEmailConfirmation=true&email=${encodeURIComponent(values.email)}`
    } catch (error: any) {
      // Tentar extrair uma mensagem de erro mais útil
      let errorMessage = "Ocorreu um erro ao criar sua conta. Por favor, tente novamente."

      if (error?.message) {
        errorMessage = error.message
      } else if (error?.error_description) {
        errorMessage = error.error_description
      } else if (typeof error === "string") {
        errorMessage = error
      }

      // Se ainda não temos informações de debug, adicionar o erro completo
      if (!debugInfo) {
        setDebugInfo(JSON.stringify(error, null, 2))
      }

      toast({
        title: "Erro ao criar conta",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para a página inicial</span>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar sua conta e receber previsões personalizadas.
            </CardDescription>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input placeholder="******" type="password" {...field} />
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
                        <Input placeholder="Sao Paulo, Caconde, Rio de Janeiro" {...field} />
                      </FormControl>
                      <FormDescription>
                        Usaremos esta informação para mostrar a previsão do tempo local. É importante que você escreva
                        somente o nome da cidade sem acentos!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profile"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Perfil de usuário</FormLabel>
                      <FormDescription>Selecione o perfil que melhor se adapta às suas necessidades.</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Entrar
                  </Link>
                </div>
              </form>
            </Form>

            {debugInfo && (
              <div className="mt-6 p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-2">Informações de depuração:</h3>
                <pre className="text-xs overflow-auto max-h-40">{debugInfo}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
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
