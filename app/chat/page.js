'use client'

import { useAuth } from '../hooks/useAuth'
import AuthPage from '../components/AuthPage'
import FullChatMode from '../components/FullChatMode'

export default function ChatPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return <FullChatMode />
}