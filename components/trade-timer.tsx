'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface TradeTimerProps {
  duration: number
  onComplete: () => void
}

export function TradeTimer({ duration, onComplete }: TradeTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (timeLeft === 0) {
      onComplete()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
      setProgress((prev) => (timeLeft - 1) * (100 / duration))
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onComplete, duration])

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h3 className="text-lg font-semibold">Trade in Progress</h3>
          <div className="text-4xl font-bold text-primary">{timeLeft}s</div>
          <div className="w-full max-w-md">
            <Progress 
              value={progress} 
              className="h-2 bg-muted"
              indicatorClassName="bg-green-500 transition-all duration-1000"
            />
          </div>
          <p className="text-sm text-muted-foreground">Please wait while your trade completes</p>
        </div>
      </CardContent>
    </Card>
  )
}
