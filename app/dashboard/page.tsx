'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard-content'
import { useLoginState } from '@/components/login-state-provider'

export default function DashboardPage() {
  const { isLoggedIn } = useLoginState()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null // or a loading spinner
  }

  return <DashboardContent />
}
