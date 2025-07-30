"use client"
import { useAuthStore } from '@/app/api/store/auth.store'
import React from 'react'

const DebugPage = () => {
  const { user, isAuthenticated, isLoading, pendingEmail } = useAuthStore()

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Debug - État d'authentification</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">État du store:</h2>
          <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
            {JSON.stringify({
              isAuthenticated,
              isLoading,
              pendingEmail,
              user: user ? {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                isVerify: user.isVerify,
                onboarding: user.onboarding
              } : null
            }, null, 2)}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Cookies:</h2>
          <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
            {typeof window !== 'undefined' ? document.cookie : 'Server side'}
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">LocalStorage auth-storage:</h2>
          <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
            {typeof window !== 'undefined' 
              ? localStorage.getItem('auth-storage') || 'Aucune donnée'
              : 'Server side'
            }
          </pre>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Conditions d'accès à /home:</h2>
          <ul className="mt-2 space-y-1">
            <li>✅ isAuthenticated: {isAuthenticated ? '✅' : '❌'}</li>
            <li>✅ user existe: {user ? '✅' : '❌'}</li>
            <li>✅ email vérifié: {user?.isVerify ? '✅' : '❌'}</li>
            <li>✅ onboarding terminé: {user?.onboarding ? '✅' : '❌'}</li>
          </ul>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Actions:</h2>
          <div className="mt-2 space-x-2">
            <button 
              onClick={() => window.location.href = '/pages/home'}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Aller à /home
            </button>
            <button 
              onClick={() => window.location.href = '/onboarding'}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Aller à /onboarding
            </button>
            <button 
              onClick={() => window.location.href = '/auth/login'}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Aller à /login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DebugPage
