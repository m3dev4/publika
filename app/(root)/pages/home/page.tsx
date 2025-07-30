"use client"
import { useAuthStore } from '@/app/api/store/auth.store'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const HomePage = () => {
  const { user, isAuthenticated, logout, hydrated } = useAuthStore()
  const router = useRouter()
  
  // Forcer la synchronisation avec les cookies au chargement
  useEffect(() => {
    if (user && isAuthenticated) {
      const currentState = useAuthStore.getState();
      const serializedData = JSON.stringify({ state: currentState, version: 0 });
      document.cookie = `auth-storage=${encodeURIComponent(serializedData)}; path=/; max-age=604800; SameSite=Lax`;
      console.log('Forced cookie sync on HomePage load');
    }
  }, [user, isAuthenticated])

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  useEffect(() => {
    // Attendre que Zustand soit hydraté avant de vérifier l'auth
    if (hydrated && !isAuthenticated) {
      console.log('Redirecting to login - not authenticated after hydration');
      router.push("/auth/login")
    }
  }, [isAuthenticated, hydrated, router])
 

  return (
    <div>
      <h1>HomePage</h1>
      <p>Bienvenue {user?.firstName}!</p>    
      <button onClick={handleLogout}>Se deconnecter</button>
    </div>
  )
}

export default HomePage