'use client'

import { useEffect } from 'react'

export default function MobileOptimizations() {
  useEffect(() => {
    // Prevent zoom on input focus (iOS)
    const handleFocusIn = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        e.target.style.fontSize = '16px'
      }
    }

    // Prevent pull-to-refresh on mobile
    const handleTouchMove = (e) => {
      if (e.touches.length > 1) return
      
      const touch = e.touches[0]
      const element = document.elementFromPoint(touch.clientX, touch.clientY)
      
      // Only prevent if not scrolling within a scrollable container
      if (!element?.closest('.overflow-y-auto, .overflow-scroll')) {
        if (window.pageYOffset === 0 && e.touches[0].clientY > e.touches[0].clientY) {
          e.preventDefault()
        }
      }
    }

    // Fix viewport height for mobile browsers
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // Add event listeners
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('resize', setViewportHeight)
    window.addEventListener('orientationchange', setViewportHeight)

    // Set initial viewport height
    setViewportHeight()

    // Cleanup
    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', setViewportHeight)
      window.removeEventListener('orientationchange', setViewportHeight)
    }
  }, [])

  return null // This component doesn't render anything
}
