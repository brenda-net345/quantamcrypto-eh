"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Copy, Upload } from "lucide-react"
import { BalanceDisplay } from "@/components/balance-display"
import { TradeTimer } from "@/components/trade-timer"
import { useLoginState } from "@/components/login-state-provider"
import { DepositTimer } from "@/components/deposit-timer"

interface User {
  name: string
  email: string
  balances: {
    usd: number
    btc: number
    eth: number
    usdt: number
  }
}

export function DashboardContent() {
  const [user, setUser] = useState<User | null>(null)
  const [depositCurrency, setDepositCurrency] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawCurrency, setWithdrawCurrency] = useState("")
  const [tradeAmount, setTradeAmount] = useState("")
  const [tradeCurrency, setTradeCurrency] = useState("")
  const [tradeType, setTradeType] = useState("30seconds")
  const [tradeError, setTradeError] = useState("")
  const [receipt, setReceipt] = useState<{ file: File | null; showTimer: boolean }>({ file: null, showTimer: false })
  const [isTrading, setIsTrading] = useState(false)
  const [withdrawError, setWithdrawError] = useState("")
  const [uploadedReceiptUrl, setUploadedReceiptUrl] = useState<string | null>(null)

  const router = useRouter()
  const { isLoggedIn, currentUser } = useLoginState()

  useEffect(() => {
    if (!isLoggedIn || !currentUser) {
      router.push("/login")
      return
    }

    const userData: User = JSON.parse(currentUser)
    setUser(userData)
  }, [isLoggedIn, currentUser, router])

  const cryptoAddresses = {
    BTC: "bc1qmrhlxl7fu9c3hwt6v87nuu62r6aaxe6eqtfecr",
    ETH: "0xD79c2cE5286e4972bEB36f434ae307462b22F1B4",
    USDT: "TW1a259jbcqBXnDT21CFxvyRUmNWAQCkss",
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Address Copied",
      description: "The deposit address has been copied to your clipboard.",
    })
  }

  const handleReceiptUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!depositCurrency || !receipt.file) {
      toast({
        title: "Error",
        description: "Please select a currency and upload a receipt.",
        variant: "destructive",
      })
      return
    }

    console.log("Uploading receipt:", receipt.file)

    // Create a URL for the uploaded file
    const fileUrl = URL.createObjectURL(receipt.file)
    setUploadedReceiptUrl(fileUrl)

    toast({
      title: "Receipt Uploaded",
      description: "Your receipt has been uploaded successfully.",
    })
    setReceipt({ file: null, showTimer: false })
  }

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    setWithdrawError("")

    const amount = Number.parseFloat(withdrawAmount)

    // Check if user has sufficient balance
    if (user) {
      let sufficientBalance = false
      switch (withdrawCurrency) {
        case "BTC":
          sufficientBalance = user.balances.btc >= amount
          break
        case "ETH":
          sufficientBalance = user.balances.eth >= amount
          break
        case "USDT":
          sufficientBalance = user.balances.usdt >= amount
          break
      }

      if (!sufficientBalance) {
        setWithdrawError("Insufficient balance for withdrawal")
        return
      }
    }

    console.log(`Withdrawing ${amount} ${withdrawCurrency}`)
    toast({
      title: "Withdrawal Initiated",
      description: `Your withdrawal of ${amount} ${withdrawCurrency} is being processed.`,
    })
    setWithdrawAmount("")
    setWithdrawCurrency("")
  }

  const handleTrade = (e: React.FormEvent) => {
    e.preventDefault()
    setTradeError("")

    const amount = Number.parseFloat(tradeAmount)

    if (tradeType === "60seconds" && amount < 5000) {
      setTradeError("Minimum amount for 60 seconds trade is $5000")
      return
    }

    setIsTrading(true)
  }

  const handleTradeComplete = () => {
    setIsTrading(false)
    toast({
      title: "Trade Completed",
      description: `Your ${tradeType} trade for ${tradeAmount} ${tradeCurrency} has been completed.`,
    })
    setTradeAmount("")
    setTradeCurrency("")
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
      <BalanceDisplay
        usdBalance={user.balances.usd}
        btcBalance={user.balances.btc}
        ethBalance={user.balances.eth}
        usdtBalance={user.balances.usdt}
      />
      <Tabs defaultValue="deposit" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="deposit">Deposit to your account</TabsTrigger>
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        </TabsList>
        <TabsContent value="deposit">
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <CardDescription>Select a cryptocurrency to get the deposit address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="depositCurrency">Select Currency</Label>
                <Select value={depositCurrency} onValueChange={setDepositCurrency}>
                  <SelectTrigger id="depositCurrency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                    <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                    <SelectItem value="USDT">Tether (USDT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {depositCurrency && (
                <div className="space-y-2">
                  <Label>Deposit Address</Label>
                  <div className="flex gap-2">
                    <Input
                      value={cryptoAddresses[depositCurrency as keyof typeof cryptoAddresses]}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(cryptoAddresses[depositCurrency as keyof typeof cryptoAddresses])}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Upload Receipt</Label>
                <form onSubmit={handleReceiptUpload} className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="receipt">Receipt</Label>
                    <Input
                      id="receipt"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        setReceipt({ file, showTimer: !!file })
                      }}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Receipt
                  </Button>
                </form>
                {receipt.showTimer && <DepositTimer />}
                {uploadedReceiptUrl && (
                  <div className="mt-4">
                    <Label>Uploaded Receipt</Label>
                    <div className="mt-2 border rounded-md p-2">
                      <img
                        src={uploadedReceiptUrl || "/placeholder.svg"}
                        alt="Uploaded Receipt"
                        className="max-w-full h-auto max-h-40 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trade">
          {isTrading ? (
            <TradeTimer duration={tradeType === "30seconds" ? 30 : 60} onComplete={handleTradeComplete} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Trade</CardTitle>
                <CardDescription>Execute ultra short time trades on BTC, ETH, or USDT.</CardDescription>
              </CardHeader>
              <form onSubmit={handleTrade}>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="tradeType">Trade Type</Label>
                    <Select value={tradeType} onValueChange={setTradeType} required>
                      <SelectTrigger id="tradeType">
                        <SelectValue placeholder="Select trade type" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="30seconds">30 seconds Ultra short time trade</SelectItem>
                        <SelectItem value="60seconds">60 seconds Ultra short time trade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="tradeCurrency">Currency</Label>
                    <Select value={tradeCurrency} onValueChange={setTradeCurrency} required>
                      <SelectTrigger id="tradeCurrency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                        <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                        <SelectItem value="USDT">Tether (USDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="tradeAmount">Amount in USD</Label>
                    <Input
                      id="tradeAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(e.target.value)}
                      required
                    />
                    {tradeType === "60seconds" && (
                      <p className="text-sm text-muted-foreground">Minimum amount: $5000</p>
                    )}
                    {tradeError && <p className="text-sm text-destructive">{tradeError}</p>}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Execute Trade
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="withdraw">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Withdraw BTC, ETH, or USDT from your account.</CardDescription>
            </CardHeader>
            <form onSubmit={handleWithdraw}>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="withdrawAmount">Amount</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    step="0.0000001"
                    min="0.0000005"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="withdrawCurrency">Currency</Label>
                  <Select value={withdrawCurrency} onValueChange={setWithdrawCurrency} required>
                    <SelectTrigger id="withdrawCurrency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                      <SelectItem value="USDT">Tether (USDT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {withdrawError && <p className="text-sm text-destructive">{withdrawError}</p>}
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Withdraw
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
