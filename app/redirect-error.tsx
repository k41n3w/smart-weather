"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RedirectErrorPage() {
  useEffect(() => {
    console.error("Erro de redirecionamento detectado")
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Erro de Redirecionamento</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Ocorreu um erro ao redirecionar para a página solicitada. Isso pode ser causado por um loop de redirecionamento.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">Voltar para a página inicial</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/login">Ir para a página de login</Link>
        </Button>
        <Button variant="destructive" asChild>
          <Link href="/clear-session">Limpar Dados de Sessão</Link>
        </Button>
      </div>
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-left max-w-lg">
        <h3 className="font-medium mb-2">Dicas para resolver:</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Limpe o cache do navegador</li>
          <li>Verifique se você está usando a URL correta</li>
          <li>Tente fazer logout e login novamente</li>
          <li>Use a página "Limpar Dados de Sessão" para remover todos os dados de autenticação</li>
          <li>Se o problema persistir, entre em contato com o suporte</li>
        </ul>
      </div>
    </div>
  )
}
