"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Bike, Car, Leaf, Umbrella, Book, ArrowLeft, Eye, EyeOff, RefreshCw } from "lucide-react"

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
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    feedback: string[]
    color: string
  }>({ score: 0, feedback: [], color: "gray" })

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

  const evaluatePasswordStrength = (password: string) => {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("Use pelo menos 8 caracteres")
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Inclua letras minúsculas")
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("Inclua letras maiúsculas")
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("Inclua números")
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push("Inclua símbolos (!@#$%^&*)")
    }

    let color = "red"
    if (score >= 4) color = "green"
    else if (score >= 3) color = "yellow"
    else if (score >= 2) color = "orange"

    return { score, feedback, color }
  }

  const generateSecurePassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*"

    let password = ""

    // Garantir pelo menos um de cada tipo
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]

    // Completar com caracteres aleatórios
    const allChars = lowercase + uppercase + numbers + symbols
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Embaralhar a senha
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setDebugInfo(null)

    try {
      console.log("Iniciando registro com:", { email: values.email, cidade: values.city, perfil: values.profile })

      // Verificar cooldown de registro
      const lastAttemptTime = localStorage.getItem(`register_attempt_${values.email}`)
      const cooldownPeriod = 60 * 1000 // 60 segundos em milissegundos

      if (lastAttemptTime) {
        const timeSinceLastAttempt = Date.now() - Number.parseInt(lastAttemptTime)
        if (timeSinceLastAttempt < cooldownPeriod) {
          const remainingSeconds = Math.ceil((cooldownPeriod - timeSinceLastAttempt) / 1000)
          toast({
            title: "Aguarde um momento",
            description: `Por favor, aguarde ${remainingSeconds} segundos antes de tentar novamente.`,
            variant: "warning",
          })
          setIsLoading(false)
          return
        }
      }

      // Substituir o bloco de verificação de usuário existente (que usa signInWithOtp) por este:

      // Verificar se o usuário já existe - vamos pular esta verificação prévia
      // e deixar o Supabase lidar com isso durante o signUp
      console.log("Registrando tentativa de registro no localStorage")
      localStorage.setItem(`register_attempt_${values.email}`, Date.now().toString())

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
          emailRedirectTo: `${window.location.origin}/?showEmailConfirmation=true&email=${encodeURIComponent(values.email)}`,
        },
      })

      if (authError) {
        console.error("Erro na autenticação:", authError)
        setDebugInfo(JSON.stringify(authError, null, 2))

        // Verificar se o erro é porque o usuário já existe
        if (authError.message?.includes("already registered")) {
          toast({
            title: "Email já registrado",
            description: "Este email já está registrado. Por favor, tente fazer login ou recuperar sua senha.",
            variant: "warning",
          })
          return
        }

        // Tratar especificamente o erro de limite de taxa de envio de email
        if (authError.status === 429 && authError.code === "over_email_send_rate_limit") {
          toast({
            title: "Limite de envio de emails atingido",
            description:
              "Muitos emails foram enviados para este endereço recentemente. Por favor, aguarde alguns minutos antes de tentar novamente ou verifique sua caixa de entrada por emails anteriores.",
            variant: "destructive",
          })
          return
        }

        throw authError
      }

      console.log("Usuário criado com sucesso:", authData)

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
          console.error("Erro ao criar perfil:", responseData)
          setDebugInfo((prev) => (prev || "") + "\n\nErro API: " + JSON.stringify(responseData, null, 2))
          // Não interromper o fluxo se o perfil falhar
        } else {
          console.log("Perfil criado com sucesso:", responseData)
          setDebugInfo((prev) => (prev || "") + "\n\nResposta API: " + JSON.stringify(responseData, null, 2))
        }
      } catch (error) {
        console.error("Erro ao criar perfil:", error)
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
      console.error("Erro ao registrar:", error)

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
    <div className="container max-w-md py-12">
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
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            placeholder="******"
                            type={showPassword ? "text" : "password"}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              setPasswordStrength(evaluatePasswordStrength(e.target.value))
                            }}
                            className="pr-20"
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                const newPassword = generateSecurePassword()
                                field.onChange(newPassword)
                                setPasswordStrength(evaluatePasswordStrength(newPassword))
                              }}
                              title="Gerar senha segura"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {field.value && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    passwordStrength.color === "red"
                                      ? "bg-red-500 w-1/5"
                                      : passwordStrength.color === "orange"
                                        ? "bg-orange-500 w-2/5"
                                        : passwordStrength.color === "yellow"
                                          ? "bg-yellow-500 w-3/5"
                                          : "bg-green-500 w-full"
                                  }`}
                                />
                              </div>
                              <span
                                className={`text-xs font-medium ${
                                  passwordStrength.color === "red"
                                    ? "text-red-600"
                                    : passwordStrength.color === "orange"
                                      ? "text-orange-600"
                                      : passwordStrength.color === "yellow"
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                }`}
                              >
                                {passwordStrength.score <= 2
                                  ? "Fraca"
                                  : passwordStrength.score === 3
                                    ? "Média"
                                    : passwordStrength.score === 4
                                      ? "Boa"
                                      : "Forte"}
                              </span>
                            </div>

                            {passwordStrength.feedback.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                <p className="font-medium mb-1">Para uma senha mais segura:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                  {passwordStrength.feedback.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Use uma senha forte com pelo menos 8 caracteres, incluindo letras, números e símbolos.
                    </FormDescription>
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
                    <FormDescription>Usaremos esta informação para mostrar a previsão do tempo local.</FormDescription>
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

          {/* Adicione este componente de aviso para usuários que já possuem conta */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <h3 className="font-medium mb-2 text-yellow-800 dark:text-yellow-400">Já possui uma conta?</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
              Se você já se registrou anteriormente, verifique seu email para o link de confirmação ou tente fazer
              login.
            </p>
            <div className="flex justify-end">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Ir para o login
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
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
