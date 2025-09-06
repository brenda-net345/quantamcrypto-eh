'use client'

import { useState, useEffect } from 'react'

export function DepositTimer() {
  const [timeLeft, setTimeLeft] = useState(5)

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timerId)
    }
  }, [timeLeft])

  if (timeLeft === 0) return null

  return (
    <div className="inline-flex items-center">
      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
      <span className="text-sm">{timeLeft}s</span>
    </div>
  )
}
