import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth-client"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Smart Weather - Recomendações Personalizadas",
  description: "Receba recomendações personalizadas com base no clima e no seu perfil",
    generator: 'v0.dev'
}

// Forçar renderização dinâmica para evitar problemas com SSG
export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
