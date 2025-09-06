'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TradePage() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC')
  const [amount, setAmount] = useState('')

  const handleTrade = (type: 'buy' | 'sell') => {
    // Implement trade logic here
    console.log(`${type} ${amount} ${selectedCrypto}`)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Market Prices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>BTC/USD</span>
              <span className="font-mono">$45,000.00</span>
            </div>
            <div className="flex justify-between">
              <span>ETH/USD</span>
              <span className="font-mono">$2,500.00</span>
            </div>
            <div className="flex justify-between">
              <span>USDT/USD</span>
              <span className="font-mono">$1.00</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger>
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                <SelectItem value="USDT">Tether (USDT)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => handleTrade('buy')} className="w-full">
                Buy
              </Button>
              <Button
                onClick={() => handleTrade('sell')}
                variant="outline"
                className="w-full"
              >
                Sell
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
