'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import NavigationBar from './NavigationBar'
import LandingPage from './LandingPage'
import RecipeCard from '@/components/RecipeCard'
import RecipeCardSkeleton from '@/skeletons/RecipeCardSkeleton'
import { Button } from '@/components/ui/button'
import { searchRecipes } from '@/api/api'

export default function HomeClient() {
  const router = useRouter()
  const [searchTerm] = useState<string>('')

  const { data, isLoading } = useQuery({
    queryKey: ['recipes', searchTerm],
    queryFn: () => searchRecipes(searchTerm),
  })

  const displayRecipes = data?.slice(0, 6) || []

  return (
    <div className='leading-none'>
      <NavigationBar />
      <LandingPage />

      <div className='bg-brand-primary'>
        <div className='justify-center' id='recipes'>
          <div className='md:text-secondary-foreground p-4 md:p-8 pt-12 max-w-7xl mx-auto'>
            <div className='columns-1 md:columns-2 xl:columns-3'>
              {isLoading
                ? [...Array(6)].map((_, i) => (
                    <div key={i} className='break-inside-avoid mb-4 md:mb-6'>
                      <RecipeCardSkeleton />
                    </div>
                  ))
                : displayRecipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      href={`/oppskrifter/${recipe.slug}`}
                      className='block break-inside-avoid mb-4 md:mb-6'
                    >
                      <RecipeCard recipe={recipe} />
                    </Link>
                  ))}
            </div>

            <div className='mt-12 mb-16 flex justify-center'>
              <Button
                variant='secondary'
                size='lg'
                className='text-lg align px-10 py-6 bg-brand-primary-foreground text-brand-primary hover:bg-brand-background transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105'
                onClick={() => router.push('/oppskrifter')}
              >
                Se flere oppskrifter →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
