import { useState, useEffect } from 'react'
import Clarity from '@microsoft/clarity'
import { Button } from './ui/button'

const CONSENT_KEY = 'cookie_consent'

function initClarity() {
  Clarity.init(import.meta.env.VITE_CLARITY_PROJECT_ID)
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (consent === 'accepted') {
      initClarity()
    } else if (!consent) {
      setVisible(true)
    }
  }, [])

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    initClarity()
    setVisible(false)
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-foreground">
          Vi bruker informasjonskapsler (cookies) for å analysere bruken av nettsiden med Microsoft Clarity.
          Dette hjelper oss å forbedre brukeropplevelsen.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleDecline}>
            Avvis
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Godta
          </Button>
        </div>
      </div>
    </div>
  )
}
