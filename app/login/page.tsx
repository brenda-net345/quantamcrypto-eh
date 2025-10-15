"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { useLoginState } from "@/components/login-state-provider"
import { getUsers, setCurrentUser } from "@/lib/storage"

interface User {
  name: string
  email: string
  password: string
  balances: {
    usd: number
    btc: number
    eth: number
    usdt: number
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true) // Default to true for convenience
  const router = useRouter()
  const { setIsLoggedIn, setCurrentUser: setLoginUser } = useLoginState()

  useEffect(() => {
    // Load remembered credentials if available
    const rememberedCredentials = localStorage.getItem("rememberedCredentials")
    if (rememberedCredentials) {
      const { email: savedEmail, password: savedPassword } = JSON.parse(rememberedCredentials)
      setEmail(savedEmail)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    const users = getUsers()
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      setCurrentUser(user)
      setLoginUser(JSON.stringify(user))
      setIsLoggedIn(true)

      // Remember credentials if checkbox is checked
      if (rememberMe) {
        localStorage.setItem("rememberedCredentials", JSON.stringify({ email, password }))
      } else {
        localStorage.removeItem("rememberedCredentials")
      }

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      })

      // Send notification without location tracking
      const timestamp = new Date().toISOString()
      await sendNotification("Login", user.name, email, timestamp)

      // Redirect to dashboard immediately
      router.push("/dashboard")
    } else {
      // Check if the email exists
      const emailExists = users.some((u) => u.email === email)

      if (emailExists) {
        toast({
          title: "Login Failed",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Email not registered",
          description: "This email is not registered. Please register first.",
          variant: "destructive",
        })
        // Redirect to registration page
        router.push("/register")
      }
    }
  }

  const sendNotification = async (type: string, name: string, email: string, timestamp: string) => {
    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, name, email, timestamp }),
      })
      if (!response.ok) {
        throw new Error("Failed to send notification")
      }
    } catch (error) {
      console.error("Error sending notification:", error)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)]">
      {/* Trust indicator at the top */}
      <div className="mb-6 text-center">
        <p className="text-base sm:text-lg text-gray-200 logo-pattern-bg">
          Trusted by <span className="text-orange-500 font-semibold">over 500k users</span> worldwide
        </p>
        <p className="text-base sm:text-lg text-gray-200 mt-1 logo-pattern-bg">Encrypted & Secure</p>
      </div>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">
              Log in
            </Button>
            <p className="mt-4 text-sm text-center">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
