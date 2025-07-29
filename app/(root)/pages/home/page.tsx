"use client"
import { useAuthStore } from '@/app/api/store/auth.store'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const HomePage = () => {
  const {user, isAuthenticated, isLoading} = useAuthStore()
  const router = useRouter()

useEffect(() => {
  if (!isAuthenticated || !user || !user.isVerify) {
    console.log("Redirecting to login - not authenticated or email not verified");
    router.push("/auth/login");
    return;
  }
}, [isAuthenticated, isLoading, user])

  return (
    <div>
      {user?.firstName}
    </div>
  )
}

export default HomePage