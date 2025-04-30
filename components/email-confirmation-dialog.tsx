"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle } from "lucide-react"

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
          </div>
          <div className="flex justify-center">
            <Button onClick={handleClose}>Entendi</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
