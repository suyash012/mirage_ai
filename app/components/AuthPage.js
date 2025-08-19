'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'
import { Lock, Sparkles, Eye, Shield, Zap, Brain, ArrowRight, CheckCircle2, Github } from 'lucide-react'

export default function AuthPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 relative overflow-hidden">
            {/* Enhanced Animated Background with more pink elements */}
            <div className="absolute inset-0">
                {/* Multiple pink gradient orbs with enhanced intensities */}
                <div className="absolute top-10 left-10 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/30 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-pink-400/25 to-pink-700/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
                <div className="absolute bottom-1/3 left-1/4 w-[450px] h-[450px] bg-gradient-to-r from-pink-600/25 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-3000"></div>

                {/* Enhanced grid pattern with stronger pink accents */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.08)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {/* More floating particles effect */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-pink-400/80 rounded-full animate-ping"></div>
                <div className="absolute top-3/4 right-1/3 w-2 h-2 bg-pink-300/90 rounded-full animate-ping delay-1000"></div>
                <div className="absolute bottom-1/4 left-2/3 w-2.5 h-2.5 bg-pink-500/80 rounded-full animate-ping delay-2000"></div>
                <div className="absolute top-1/2 left-1/6 w-1.5 h-1.5 bg-pink-600/70 rounded-full animate-ping delay-500"></div>
                <div className="absolute bottom-1/6 right-1/6 w-2 h-2 bg-pink-400/60 rounded-full animate-ping delay-1500"></div>
            </div>

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Main Auth Card with enhanced styling */}
                    <div className="bg-gradient-to-br from-gray-950/95 via-gray-900/90 to-black/95 backdrop-blur-2xl border border-pink-500/30 rounded-3xl p-10 shadow-2xl shadow-pink-500/20">
                        {/* Header with enhanced Lock Icon */}
                        <div className="text-center mb-10">
                            <div className="relative mx-auto mb-8">
                                {/* Enhanced outer glow rings with stronger effects */}
                                <div className="absolute inset-0 w-28 h-28 bg-pink-500/40 rounded-full blur-2xl animate-pulse"></div>
                                <div className="absolute inset-1 w-26 h-26 bg-pink-400/30 rounded-full blur-xl animate-pulse delay-500"></div>
                                <div className="absolute inset-2 w-24 h-24 bg-pink-300/20 rounded-full blur-lg animate-pulse delay-1000"></div>
                                {/* Lock container with enhanced gradient and glow */}
                                <div className="relative w-28 h-28 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-700 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/50 border-2 border-pink-300/40">
                                    <Lock className="w-14 h-14 text-white drop-shadow-xl" />
                                    {/* Enhanced sparkle effects */}
                                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-pink-400/40">
                                        <Sparkles className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-pink-300/90 rounded-full animate-ping delay-1000"></div>
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-pink-200/80 rounded-full animate-ping delay-500"></div>
                                </div>
                            </div>

                            {/* Enhanced Brand */}
                            <h1 className="text-4xl font-bold mb-3">
                                <span className="bg-gradient-to-r from-pink-300 via-pink-200 to-white bg-clip-text text-transparent drop-shadow-lg">
                                    Mirage AI
                                </span>
                            </h1>
                            <p className="text-pink-300/90 text-lg mb-8 font-medium">Next-Gen AI Platform</p>

                            {/* Enhanced Tagline with better styling */}
                            <div className="bg-gradient-to-r from-pink-500/20 via-pink-600/15 to-pink-500/20 border border-pink-400/40 rounded-2xl p-6 mb-8 shadow-xl shadow-pink-500/15 backdrop-blur-sm">
                                <p className="text-pink-100 text-base font-bold tracking-wide flex items-center justify-center gap-2">
                                    <span className="text-pink-400">✨</span>
                                    Unleash the Power of Next-Gen AI
                                    <span className="text-pink-400">✨</span>
                                </p>
                                <p className="text-pink-300/80 text-sm mt-2 font-medium">
                                    Multi-model intelligence at your fingertips
                                </p>
                            </div>
                        </div>

                        {/* Enhanced Features Preview with better styling */}
                        <div className="space-y-5 mb-10">
                            <div className="flex items-center gap-4 text-sm p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-transparent border-l-4 border-pink-400/60 hover:from-pink-500/15 transition-all duration-300">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-xl shadow-pink-500/30">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-gray-100 font-semibold">Compare 5+ AI models simultaneously</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-transparent border-l-4 border-pink-400/60 hover:from-pink-500/15 transition-all duration-300">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-xl shadow-pink-500/30">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-gray-100 font-semibold">Real-time web search & analysis</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-transparent border-l-4 border-pink-400/60 hover:from-pink-500/15 transition-all duration-300">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-xl shadow-pink-500/30">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-gray-100 font-semibold">Military-grade encryption</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm p-4 rounded-xl bg-gradient-to-r from-pink-500/10 to-transparent border-l-4 border-pink-400/60 hover:from-pink-500/15 transition-all duration-300">
                                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-xl shadow-pink-500/30">
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-gray-100 font-semibold">Unlimited conversations & history</span>
                            </div>
                        </div>

                        {/* Auth Component */}
                        <div className="auth-container">
                            <Auth
                                supabaseClient={supabase}
                                appearance={{
                                    theme: ThemeSupa,
                                    variables: {
                                        default: {
                                            colors: {
                                                brand: '#f472b6',
                                                brandAccent: '#ec4899',
                                                brandButtonText: 'white',
                                                defaultButtonBackground: 'rgba(0, 0, 0, 0.8)',
                                                defaultButtonBackgroundHover: 'rgba(17, 24, 39, 0.9)',
                                                defaultButtonBorder: 'rgba(244, 114, 182, 0.3)',
                                                defaultButtonText: 'rgba(244, 114, 182, 0.9)',
                                                dividerBackground: 'rgba(244, 114, 182, 0.2)',
                                                inputBackground: 'rgba(0, 0, 0, 0.7)',
                                                inputBorder: 'rgba(244, 114, 182, 0.3)',
                                                inputBorderHover: 'rgba(244, 114, 182, 0.5)',
                                                inputBorderFocus: '#f472b6',
                                                inputText: 'white',
                                                inputLabelText: 'rgba(244, 114, 182, 0.8)',
                                                inputPlaceholder: 'rgba(244, 114, 182, 0.4)',
                                            },
                                            space: {
                                                spaceSmall: '6px',
                                                spaceMedium: '12px',
                                                spaceLarge: '20px',
                                                labelBottomMargin: '8px',
                                                anchorBottomMargin: '6px',
                                                emailInputSpacing: '6px',
                                                socialAuthSpacing: '8px',
                                                buttonPadding: '14px 20px',
                                                inputPadding: '14px 16px',
                                            },
                                            fontSizes: {
                                                baseBodySize: '14px',
                                                baseInputSize: '14px',
                                                baseLabelSize: '13px',
                                                baseButtonSize: '14px',
                                            },
                                            borderWidths: {
                                                buttonBorderWidth: '1px',
                                                inputBorderWidth: '1px',
                                            },
                                            radii: {
                                                borderRadiusButton: '12px',
                                                buttonBorderRadius: '12px',
                                                inputBorderRadius: '12px',
                                            },
                                        },
                                    },
                                    className: {
                                        container: 'modern-auth-container',
                                        button: 'modern-auth-button',
                                        input: 'modern-auth-input',
                                    },
                                }}
                                providers={[]}
                                redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/` : undefined}
                            />
                        </div>

                        {/* Enhanced Security Badge */}
                        <div className="flex items-center justify-center gap-3 mt-6 p-4 bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl border border-pink-500/30 shadow-lg shadow-pink-500/10">
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <span className="text-sm text-pink-200 font-semibold block">Military-Grade Security</span>
                                <span className="text-xs text-pink-300/70">End-to-end encrypted conversations</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-6">
                            <p className="text-xs text-gray-500">
                                By continuing, you agree to our
                                <span className="text-pink-400 hover:text-pink-300 cursor-pointer"> Terms</span> and
                                <span className="text-pink-400 hover:text-pink-300 cursor-pointer"> Privacy Policy</span>
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Bottom Features */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="text-center p-5 bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-2xl border border-pink-500/20 hover:border-pink-400/40 transition-all duration-300 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/25">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm text-pink-200 font-semibold">Multi-Model</p>
                            <p className="text-xs text-pink-300/60 mt-1">3+ AI Systems</p>
                        </div>
                        <div className="text-center p-5 bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-2xl border border-pink-500/20 hover:border-pink-400/40 transition-all duration-300 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/25">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm text-pink-200 font-semibold">Lightning Fast</p>
                            <p className="text-xs text-pink-300/60 mt-1">Sub-second Response</p>
                        </div>
                        <div className="text-center p-5 bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-2xl border border-pink-500/20 hover:border-pink-400/40 transition-all duration-300 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-pink-500/25">
                                <Eye className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-sm text-pink-200 font-semibold">Real-time</p>
                            <p className="text-xs text-pink-300/60 mt-1">Live Updates</p>
                        </div>
                    </div>

                    {/* Enhanced Call to Action */}
                    <div className="text-center mt-8">
                        <div className="bg-gradient-to-r from-pink-500/10 via-pink-600/5 to-pink-500/10 rounded-2xl p-6 border border-pink-500/20">
                            <p className="text-pink-100 text-base font-semibold mb-2">
                                Join the AI Revolution
                            </p>
                            <p className="text-pink-300/70 text-sm mb-3">
                                Experience the next generation of intelligent conversations
                            </p>
                            <div className="flex items-center justify-center gap-2 mt-3">
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 border-black"></div>
                                    <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full border-2 border-black"></div>
                                    <div className="w-6 h-6 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full border-2 border-black"></div>
                                </div>
                                <span className="text-pink-300 text-sm font-medium ml-2">10,000+ developers trust Mirage</span>
                                <ArrowRight className="w-4 h-4 text-pink-400 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}