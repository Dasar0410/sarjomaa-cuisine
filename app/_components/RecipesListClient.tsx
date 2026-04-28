'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import NavigationBar from './NavigationBar'
import FilterSearch from '@/components/FilterSearch'
import RecipeCard from '@/components/RecipeCard'
import RecipeCardSkeleton from '@/skeletons/RecipeCardSkeleton'
import { searchRecipes } from '@/api/api'

export default function RecipesListClient() {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['recipes', searchTerm],
    queryFn: () => searchRecipes(searchTerm),
    placeholderData: keepPreviousData,
  })

  return (
    <div>
      <NavigationBar />
      <FilterSearch onSearchChange={setSearchTerm} />
      <div className='card-container columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-3 gap-4 md:gap-6 px-4 py-4 space-y-4 max-w-7xl mx-auto'>
        {isLoading && recipes.length === 0
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='block mb-4 md:mb-6 break-inside-avoid'>
                <RecipeCardSkeleton />
              </div>
            ))
          : recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/oppskrifter/${recipe.slug}`}
                className='block mb-4 md:mb-6 break-inside-avoid'
              >
                <RecipeCard recipe={recipe} />
              </Link>
            ))}
      </div>
    </div>
  )
}
