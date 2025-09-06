"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Send, MessageCircle } from "lucide-react"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/send-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully. We'll get back to you soon!",
        })
        // Reset form
        setName("")
        setEmail("")
        setMessage("")
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTelegramClick = () => {
    // Replace with your actual Telegram username or link
    window.open("https://t.me/quantumcrypto_support", "_blank")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl contact-page">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4 logo-pattern-bg">Contact Us</h1>
        <p className="text-gray-200 logo-pattern-bg">
          Have questions or need support? We're here to help! Send us a message and we'll get back to you as soon as
          possible.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Send us a Message</CardTitle>
          <CardDescription>Fill out the form below and we'll respond to your inquiry promptly.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="resize-none"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Telegram Contact Section */}
      <div className="mt-8 text-center">
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4 logo-pattern-bg">Need Immediate Support?</h3>
          <p className="text-gray-200 mb-4 logo-pattern-bg">Connect with us on Telegram for instant assistance</p>
          <Button
            onClick={handleTelegramClick}
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact us on Telegram
          </Button>
        </div>
      </div>
    </div>
  )
}
