"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function EmailConfirmationDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    // Verificar se há parâmetros de consulta para mostrar o diálogo
    const showEmailConfirmation = searchParams.get("showEmailConfirmation")
    const emailParam = searchParams.get("email")

    if (showEmailConfirmation === "true" && emailParam) {
      setEmail(emailParam)
      setOpen(true)
    }
  }, [searchParams])

  const handleClose = () => {
    setOpen(false)

    // Usar window.history.replaceState para limpar os parâmetros da URL sem redirecionar
    const url = new URL(window.location.href)
    url.searchParams.delete("showEmailConfirmation")
    url.searchParams.delete("email")
    window.history.replaceState({}, "", url.pathname)
  }

  // Adicione esta função dentro do componente EmailConfirmationDialog, antes do return
  const handleResendEmail = async () => {
    if (!email) return

    // Verificar cooldown de reenvio
    const lastResendTime = localStorage.getItem(`email_resend_${email}`)
    const cooldownPeriod = 60 * 1000 // 60 segundos

    if (lastResendTime) {
      const timeSinceLastResend = Date.now() - Number.parseInt(lastResendTime)
      if (timeSinceLastResend < cooldownPeriod) {
        const remainingSeconds = Math.ceil((cooldownPeriod - timeSinceLastResend) / 1000)
        alert(`Por favor, aguarde ${remainingSeconds} segundos antes de solicitar outro email.`)
        return
      }
    }

    try {
      const supabase = createClientComponentClient()
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/?showEmailConfirmation=true&email=${encodeURIComponent(email)}`,
        },
      })

      if (error) {
        if (error.status === 429) {
          alert(
            "Muitos emails foram enviados recentemente. Por favor, aguarde alguns minutos antes de tentar novamente.",
          )
        } else {
          alert(`Erro ao reenviar email: ${error.message}`)
        }
        return
      }

      // Registrar tentativa de reenvio
      localStorage.setItem(`email_resend_${email}`, Date.now().toString())
      alert("Email de confirmação reenviado com sucesso!")
    } catch (err) {
      alert("Ocorreu um erro ao tentar reenviar o email de confirmação.")
      console.error(err)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose()
        } else {
          setOpen(true)
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">Verifique seu email</DialogTitle>
          <DialogDescription className="text-center">
            Enviamos um link de confirmação para <span className="font-medium">{email}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Para completar seu cadastro e acessar todas as funcionalidades, por favor verifique seu email e clique no
              link de confirmação que enviamos.
            </p>
            <div className="rounded-md bg-primary/5 p-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Após confirmar seu email:</p>
                  <ul className="mt-1 list-inside space-y-1 text-muted-foreground">
                    <li>Você poderá fazer login na plataforma</li>
                    <li>Acessar seu painel personalizado</li>
                    <li>Receber recomendações baseadas no clima</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Adicione esta seção com instruções adicionais */}
            <div className="mt-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Não recebeu o email?</p>
              <ul className="mt-1 list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                <li>Verifique sua pasta de spam ou lixo eletrônico</li>
                <li>Aguarde alguns minutos, o email pode demorar para chegar</li>
                <li>Verifique se o endereço de email está correto</li>
              </ul>
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800"
                  onClick={handleResendEmail}
                >
                  Reenviar email de confirmação
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button onClick={handleClose}>Entendi</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
