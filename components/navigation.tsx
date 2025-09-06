"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useLoginState } from "@/components/login-state-provider"

export function Navigation() {
  const { isLoggedIn, setIsLoggedIn, setCurrentUser } = useLoginState()
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

  return (
    <nav className="border-b border-orange-700 bg-black">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl sm:text-3xl font-bold text-white">
          Quantum<span className="text-orange-500">Crypto</span>
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="text-white text-sm sm:text-base border-primary hover:bg-primary/10"
                >
                  Contact
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="text-white text-sm sm:text-base border-primary hover:bg-primary/10"
                >
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                className="text-white text-sm sm:text-base border-primary hover:bg-primary/10"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="outline" className="text-white text-sm sm:text-base border-primary hover:bg-primary/10">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
