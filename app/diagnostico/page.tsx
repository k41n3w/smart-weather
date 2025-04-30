"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, RefreshCw, Bug } from "lucide-react"
import Link from "next/link"

export default function DiagnosticPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [browserInfo, setBrowserInfo] = useState<any>({})
  const [networkStatus, setNetworkStatus] = useState<string>("desconhecido")
  const [storageStatus, setStorageStatus] = useState<string>("desconhecido")
  const [isLoading, setIsLoading] = useState(true)

  // Função para adicionar logs
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${message}`)
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev])
  }

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      addLog("Iniciando logout forçado")

      // Limpar localStorage
      try {
        localStorage.removeItem("supabase.auth.token")
        localStorage.removeItem("sb-kdbqyaznwpkpxxmhkdtn-auth-token")
        localStorage.removeItem("userProfile")
        addLog("LocalStorage limpo com sucesso")
      } catch (e: any) {
        addLog(`Erro ao limpar localStorage: ${e.message}`)
      }

      // Limpar cookies
      try {
        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
        })
        addLog("Cookies limpos com sucesso")
      } catch (e: any) {
        addLog(`Erro ao limpar cookies: ${e.message}`)
      }

      addLog("Redirecionando para página inicial")
      window.location.href = "/"
    } catch (e: any) {
      addLog(`Erro durante logout: ${e.message}`)
      // Forçar redirecionamento mesmo com erro
      window.location.href = "/"
    }
  }

  // Função para recarregar a página
  const handleRefresh = () => {
    addLog("Recarregando página")
    window.location.reload()
  }

  // Efeito para coletar informações de diagnóstico
  useEffect(() => {
    addLog("Iniciando diagnóstico")

    // Coletar informações do navegador
    try {
      const browserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        platform: navigator.platform,
        vendor: navigator.vendor,
      }
      setBrowserInfo(browserInfo)
      addLog(`Informações do navegador coletadas: ${JSON.stringify(browserInfo)}`)

      setNetworkStatus(navigator.onLine ? "online" : "offline")
    } catch (e: any) {
      addLog(`Erro ao coletar informações do navegador: ${e.message}`)
    }

    // Verificar localStorage
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      setStorageStatus("disponível")
      addLog("LocalStorage está disponível")
    } catch (e: any) {
      setStorageStatus("indisponível")
      addLog(`LocalStorage indisponível: ${e.message}`)
    }

    // Verificar conexão com internet
    fetch("https://www.google.com", { mode: "no-cors", cache: "no-cache" })
      .then(() => {
        addLog("Conexão com internet OK")
      })
      .catch((error) => {
        addLog(`Erro na conexão com internet: ${error.message}`)
      })
      .finally(() => {
        setIsLoading(false)
      })

    // Timeout para garantir que o carregamento termine
    const timeout = setTimeout(() => {
      if (isLoading) {
        addLog("Timeout de diagnóstico atingido")
        setIsLoading(false)
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Diagnóstico do Sistema
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Estado do sistema</h3>
                <div className="p-4 bg-muted rounded-md">
                  <p>
                    <strong>Rede:</strong> {networkStatus}
                  </p>
                  <p>
                    <strong>LocalStorage:</strong> {storageStatus}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Ações de diagnóstico</h3>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Recarregar página
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Forçar logout
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/login">Ir para login</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Informações do navegador</h3>
              <pre className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-40">
                {JSON.stringify(browserInfo, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="font-medium mb-2">Logs de diagnóstico</h3>
              <div className="p-4 bg-muted rounded-md text-xs overflow-auto max-h-96">
                {logs.map((log, i) => (
                  <div key={i} className="mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-medium mb-2 text-yellow-800 dark:text-yellow-400">Possíveis soluções</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
                <li>Limpe o cache e cookies do navegador</li>
                <li>Use o botão "Forçar logout" acima</li>
                <li>Tente usar outro navegador</li>
                <li>Verifique sua conexão com a internet</li>
                <li>Desative extensões do navegador que possam estar interferindo</li>
                <li>Tente usar uma janela anônima/privativa</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
