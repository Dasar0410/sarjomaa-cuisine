import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRecipeBySlug } from '@/api/api'
import RecipeDetailClient from '../../_components/RecipeDetailClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)

  if (!recipe) {
    return { title: 'Oppskrift ikke funnet — SarjoMat' }
  }

  const url = `https://sarjomat.no/oppskrifter/${recipe.slug ?? slug}`

  return {
    title: `${recipe.title} — SarjoMat`,
    description: recipe.description,
    alternates: { canonical: url },
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      url,
      images: recipe.image_url ? [recipe.image_url] : undefined,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)

  if (!recipe) {
    notFound()
  }

  const reviewCount = 0
  const avgRating: number | undefined = undefined

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.image_url,
    author: { '@type': 'Person', name: 'Daniel Sarjomaa' },
    datePublished: recipe.created_at,
    recipeCuisine: recipe.cuisine,
    recipeCategory: recipe.meal_type,
    recipeYield: `${recipe.servings} porsjoner`,
    cookTime: `PT${recipe.cook_time}M`,
    ...(recipe.tags && recipe.tags.length > 0 && {
      keywords: recipe.tags.map(t => t.name).join(', '),
    }),
    recipeIngredient: recipe.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`.trim()),
    recipeInstructions: [...recipe.steps]
      .sort((a, b) => a.stepNumber - b.stepNumber)
      .map(s => ({ '@type': 'HowToStep', text: s.instruction })),
    ...(recipe.nutrition && {
      nutrition: {
        '@type': 'NutritionInformation',
        calories: `${recipe.nutrition.calories} calories`,
        proteinContent: `${recipe.nutrition.protein}g`,
        carbohydrateContent: `${recipe.nutrition.carbohydrates}g`,
        fatContent: `${recipe.nutrition.fat}g`,
        fiberContent: `${recipe.nutrition.fiber}g`,
      },
    }),
    ...(avgRating !== undefined && reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (avgRating as number).toFixed(1),
        reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecipeDetailClient slug={slug} initialRecipe={recipe} />
    </>
  )
}
