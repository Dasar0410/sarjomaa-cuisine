'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import NavigationBar from './NavigationBar'
import Reviews from './Reviews'
import TitleInstructionCards from '@/components/TitleInstructionCard'
import IngredientsCard from '@/components/IngredientsCard'
import NutritionCard from '@/components/NutritionCard'
import TitleInstructionCardSkeleton from '@/skeletons/TitleInstructionCardSkeleton'
import IngredientsCardSkeleton from '@/skeletons/IngredientsCardSkeleton'
import NutritionCardSkeleton from '@/skeletons/NutritionCardSkeleton'
import { getRecipeBySlug } from '@/api/api'
import { getReviewsByRecipeId } from '@/api/review'
import { UserAuth } from '@/context/AuthContext'
import { Recipe } from '@/types/recipe'

interface Props {
  slug: string
  initialRecipe: Recipe | null
}

export default function RecipeDetailClient({ slug, initialRecipe }: Props) {
  const { session } = UserAuth()

  const { data: recipeData, isLoading } = useQuery({
    queryKey: ['recipe', slug],
    queryFn: () => getRecipeBySlug(slug),
    initialData: initialRecipe ?? undefined,
  })

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', recipeData?.id],
    queryFn: () => getReviewsByRecipeId(recipeData!.id!),
    enabled: !!recipeData?.id,
  })

  const userReview = reviews.find(r => r.user_id === session?.user.id) ?? null
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : undefined

  const [portions, setPortions] = useState(1)

  useEffect(() => {
    if (recipeData?.servings) {
      setPortions(recipeData.servings)
    }
  }, [recipeData?.servings])

  return (
    <>
      <div><NavigationBar /></div>

      <div className='flex flex-col md:flex-row md:flex-wrap md:justify-center'>
        <div className='w-full flex justify-center'>
          {isLoading && !recipeData
            ? <div className='mb-4 md:mb-10 md:my-10 w-full md:w-2/5 aspect-[4/3] bg-gray-300 animate-pulse rounded-2xl' />
            : recipeData && <img src={recipeData.image_url} alt={recipeData.title} className='mb-4 md:mb-10 md:my-10 md:w-2/5 object-cover rounded-2xl' />
          }
        </div>

        <div className='contents md:flex md:flex-col md:w-1/2'>
          <div className='order-1 md:order-none'>
            {isLoading && !recipeData ? <TitleInstructionCardSkeleton /> : recipeData && <TitleInstructionCards recipe={recipeData} avgRating={avgRating} reviewCount={reviews.length} />}
          </div>
          <div className='order-last md:order-none'>
            {recipeData && <Reviews recipeId={recipeData.id!} reviews={reviews} userReview={userReview} />}
          </div>
        </div>

        <div className='order-2 md:order-none flex flex-col'>
          {isLoading && !recipeData ? <IngredientsCardSkeleton /> : recipeData && <IngredientsCard recipe={recipeData} portions={portions} setPortions={setPortions} />}
          {isLoading && !recipeData ? <NutritionCardSkeleton /> : recipeData && <NutritionCard recipe={recipeData} portions={portions} />}
        </div>
      </div>
    </>
  )
}
