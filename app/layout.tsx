import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { LoginStateProvider } from "@/components/login-state-provider"
import { BackgroundImage } from "@/components/background-image"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "QuantumCrypto - Cryptocurrency Trading Platform",
  description: "Trade Bitcoin, Ethereum, and USDT on our secure platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen dark:bg-gray-900`}>
        <ThemeProvider>
          <LoginStateProvider>
            <BackgroundImage />
            <Navigation />
            <main className="container mx-auto px-4 py-8 relative z-10">{children}</main>
            <Toaster />
          </LoginStateProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'