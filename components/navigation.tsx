"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useLoginState } from "@/components/login-state-provider"
import { Moon, Sun } from "lucide-react"

export function Navigation() {
  const { isLoggedIn, setIsLoggedIn, setCurrentUser } = useLoginState()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    // Remove remembered credentials when user explicitly logs out
    localStorage.removeItem("rememberedCredentials")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="border-b border-orange-700 bg-black">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl sm:text-3xl font-bold text-white">
          Quantum<span className="text-orange-500">Crypto</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="text-white border-primary hover:bg-primary/10 bg-transparent"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {isLoggedIn ? (
            <>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="text-white text-sm sm:text-base border-primary hover:bg-primary/10 bg-transparent"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="text-white text-sm sm:text-base border-primary hover:bg-primary/10 bg-transparent"
                >
                  Contact
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-white text-sm sm:text-base border-primary hover:bg-primary/10 bg-transparent"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                className="text-white text-sm sm:text-base border-primary hover:bg-primary/10 bg-transparent"
              >
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
