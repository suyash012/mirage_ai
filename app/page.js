'use client'

import { useAuth } from './hooks/useAuth'
import AuthPage from './components/AuthPage'
import { MessageCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex items-center justify-center">
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black backdrop-blur-xl border border-pink-500/30 rounded-3xl p-12 flex flex-col items-center gap-6 shadow-2xl shadow-pink-500/20">
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
          <p className="text-pink-100 font-semibold text-lg">Loading Mirage AI...</p>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <header className="text-center mb-20">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <div className="absolute inset-0 w-20 h-20 bg-pink-500/30 rounded-2xl blur-xl animate-pulse"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-pink-500/40 border border-pink-400/30">
                <svg className="w-10 h-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-pink-100 to-pink-200 bg-clip-text text-transparent">
              Mirage AI
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience the future of AI interaction. Compare responses from multiple cutting-edge AI models 
            side-by-side and discover diverse perspectives for your questions.
          </p>
          <div className="flex justify-center mb-8">
            <Link
              href="/chat"
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 text-lg shadow-2xl shadow-pink-500/40 hover:shadow-pink-500/60 hover:scale-105 border border-pink-400/30"
            >
              <MessageCircle size={26} className="group-hover:rotate-12 transition-transform duration-300" />
              Start Your AI Journey
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
          
          {/* Stats Section */}
          <div className="flex justify-center items-center gap-8 text-center">
            <div className="bg-gradient-to-br from-gray-950/80 to-gray-900/80 backdrop-blur-sm border border-pink-500/20 rounded-xl px-6 py-4">
              <div className="text-2xl font-bold text-pink-400">3+</div>
              <div className="text-sm text-gray-400">AI Models</div>
            </div>
            <div className="bg-gradient-to-br from-gray-950/80 to-gray-900/80 backdrop-blur-sm border border-pink-500/20 rounded-xl px-6 py-4">
              <div className="text-2xl font-bold text-pink-400">∞</div>
              <div className="text-sm text-gray-400">Conversations</div>
            </div>
            <div className="bg-gradient-to-br from-gray-950/80 to-gray-900/80 backdrop-blur-sm border border-pink-500/20 rounded-xl px-6 py-4">
              <div className="text-2xl font-bold text-pink-400">24/7</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group bg-gradient-to-br from-gray-950/90 via-gray-900/80 to-gray-950/90 backdrop-blur-xl border border-pink-500/20 p-8 rounded-2xl transition-all duration-300 hover:border-pink-400/40 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"/>
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-4 text-white group-hover:text-pink-100 transition-colors">Side-by-Side Comparison</h3>
            <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">Compare responses from multiple AI models in real-time, then select your favorite to continue the conversation with enhanced insights.</p>
            <div className="mt-6 flex items-center text-pink-400 font-medium text-sm group-hover:text-pink-300 transition-colors">
              <span>Learn More</span>
              <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-gray-950/90 via-gray-900/80 to-gray-950/90 backdrop-blur-xl border border-pink-500/20 p-8 rounded-2xl transition-all duration-300 hover:border-pink-400/40 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-4 text-white group-hover:text-pink-100 transition-colors">Seamless Model Selection</h3>
            <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">Start with comparison mode, then seamlessly switch to focused chat with your preferred AI model for deeper conversations.</p>
            <div className="mt-6 flex items-center text-pink-400 font-medium text-sm group-hover:text-pink-300 transition-colors">
              <span>Explore Feature</span>
              <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          
          <div className="group bg-gradient-to-br from-gray-950/90 via-gray-900/80 to-gray-950/90 backdrop-blur-xl border border-pink-500/20 p-8 rounded-2xl transition-all duration-300 hover:border-pink-400/40 hover:shadow-2xl hover:shadow-pink-500/20 hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <h3 className="font-bold text-xl mb-4 text-white group-hover:text-pink-100 transition-colors">Advanced Features</h3>
            <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">Web search integration, multiple response modes, intelligent conversation management, and enterprise-grade security.</p>
            <div className="mt-6 flex items-center text-pink-400 font-medium text-sm group-hover:text-pink-300 transition-colors">
              <span>View All Features</span>
              <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}