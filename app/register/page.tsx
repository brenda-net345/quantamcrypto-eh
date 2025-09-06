"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { useLoginState } from "@/components/login-state-provider"
import { getUsers, saveUser, setCurrentUser } from "@/lib/storage"

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

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [invitationCode, setInvitationCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { setIsLoggedIn, setCurrentUser: setLoginUser } = useLoginState()

  const VALID_INVITATION_CODE = "20FFTP"

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate invitation code first
    if (invitationCode !== VALID_INVITATION_CODE) {
      toast({
        title: "Invalid Invitation Code",
        description: "Please enter a valid invitation code to proceed with registration.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      })
      return
    }

    // Check if user already exists
    const existingUsers = getUsers()
    if (existingUsers.some((user) => user.email === email)) {
      toast({
        title: "Registration Failed",
        description: "A user with this email already exists.",
        variant: "destructive",
      })
      return
    }

    // Set initial balances based on the user's name - only for specific predefined users
    let initialBalances = {
      usd: 0,
      btc: 0,
      eth: 0,
      usdt: 0,
    }

    // Only set special balances for these specific predefined users
    if (name.toLowerCase() === "dante") {
      initialBalances = {
        usd: 7099,
        btc: 0.0005,
        eth: 0.004,
        usdt: 0,
      }
    } else if (name.toLowerCase() === "will") {
      initialBalances = {
        usd: 5000,
        btc: 0.08,
        eth: 0,
        usdt: 0,
      }
    } else if (name.toLowerCase() === "evah") {
      initialBalances = {
        usd: 73849.24,
        btc: 0.7892,
        eth: 2.974,
        usdt: 1705.086,
      }
    } else if (name.toLowerCase() === "john") {
      initialBalances = {
        usd: 250,
        btc: 0.0043,
        eth: 0,
        usdt: 0,
      }
    }
    // All other new users will have zero balances

    // Create and save new user
    const newUser: User = { name, email, password, balances: initialBalances }
    saveUser(newUser)
    setCurrentUser(newUser)
    setLoginUser(JSON.stringify(newUser))
    setIsLoggedIn(true)

    // Automatically remember credentials for new users
    localStorage.setItem("rememberedCredentials", JSON.stringify({ email, password }))

    // Send notification without location tracking
    const timestamp = new Date().toISOString()
    await sendNotification("Registration", name, email, timestamp)

    toast({
      title: "Registration Successful",
      description: "You have successfully registered and logged into your account.",
    })

    // Redirect to dashboard
    router.push("/dashboard")
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
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create an account to start trading.</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="invitationCode">Invitation Code</Label>
                <Input
                  id="invitationCode"
                  placeholder="Enter invitation code"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                  required
                  className="font-mono tracking-wider"
                />
                <p className="text-xs text-muted-foreground">An invitation code is required to register</p>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">
              Register
            </Button>
            <p className="mt-4 text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
