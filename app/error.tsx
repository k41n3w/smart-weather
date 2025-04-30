"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para o console
    console.error("Erro na aplicação:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Algo deu errado</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Ocorreu um erro ao carregar esta página. Nossa equipe foi notificada.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()}>Tentar novamente</Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Voltar para a página inicial
        </Button>
        <Button variant="destructive" asChild>
          <Link href="/clear-session">Limpar Dados de Sessão</Link>
        </Button>
      </div>
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-left max-w-lg overflow-auto">
        <h3 className="font-medium mb-2">Detalhes do erro:</h3>
        <p className="text-sm text-red-500 dark:text-red-400">{error.message}</p>
        {error.stack && <pre className="text-xs mt-2 overflow-auto max-h-40 whitespace-pre-wrap">{error.stack}</pre>}
      </div>
    </div>
  )
}
