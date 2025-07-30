import { SessionNavBar } from '@/components/sessionNavBar'
import { Sidebar } from '@/components/ui/sidebar'
import React from 'react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="min-h-screen w-screen max-w-md mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <SessionNavBar />
                </div>
            </div>
                
            {children}
        </main>
    )
}

export default RootLayout
