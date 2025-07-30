"use client"
import { useAuthStore } from '@/app/api/store/auth.store'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const HomePage = () => {
  const {user, isAuthenticated, isLoading, hydrated} = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    console.log("HomePage - Auth state:", { user, isAuthenticated, isLoading, hydrated });
    
    if (isLoading || !hydrated) return;
    
    if (!isAuthenticated || !user) {
      console.log("Redirecting to login - not authenticated");
      router.push("/auth/login");
      return;
    }
    
    if (!user.isVerify) {
      console.log("Redirecting to verify-email - email not verified");
      router.push("/auth/verify-email");
      return;
    }
    
    if (!user.onboarding) {
      console.log("Redirecting to onboarding - onboarding not completed");
      router.push("/onboarding");
      return;
    }
  }, [user, isAuthenticated, isLoading, hydrated, router])


  if (isLoading || !hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1>HomePage</h1>
      <p>Bienvenue {user?.firstName} {user?.lastName}!</p>
    </div>
  )
}

export default HomePage