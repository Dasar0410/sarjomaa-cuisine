'use client'

import { useRouter } from 'next/navigation'
import { UserAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { landingBgPattern } from '@/lib/landingBgPattern'

export default function LandingPage() {
  const { session, loading } = UserAuth()
  const fullName = session?.user?.user_metadata?.display_name || session?.user?.user_metadata?.full_name || 'Gjest'
  const name = loading ? '' : fullName.split(' ')[0]
  const router = useRouter()

  return (
    <section
      className="relative text-white flex flex-col cursor-default pb-8"
      style={{
        backgroundColor: '#edf1d5',
        backgroundImage: `radial-gradient(ellipse 600px 400px at 50% 40%, #edf1d5 60%, transparent 85%), ${landingBgPattern}`,
        backgroundPosition: '0 0, 0 10px',
      }}
    >
      <div className="flex-1 max-w-7xl mx-auto px-4 pt-10 flex flex-col items-center">
        <div className="w-full space-y-4 text-center md:mb-8">
          <h1 className="md:text-6xl text-5xl font-bold md:leading-tight leading-tight text-brand-foreground">
            Hei <span className="text-brand-primary">{name}</span>,
          </h1>
          <p className="text-3xl text-brand-foreground/70">
            Oppdag haugevis av deilige oppskrifter
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push('/oppskrifter')}
            className="text-lg py-6 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 mt-6"
          >
            Se alle oppskrifter →
          </Button>
        </div>
      </div>
    </section>
  )
}
