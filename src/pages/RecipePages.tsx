import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import NavigationBar from '../components/NavigationBar'
import TitleInstructionCards from '../components/TitleInstructionCard'
import IngredientsCard from '../components/IngredientsCard'
import NutritionCard from '../components/NutritionCard'
import Reviews from '../components/Reviews'
import TitleInstructionCardSkeleton from '../skeletons/TitleInstructionCardSkeleton'
import IngredientsCardSkeleton from '../skeletons/IngredientsCardSkeleton'
import NutritionCardSkeleton from '../skeletons/NutritionCardSkeleton'
import { getRecipeBySlug } from '../api/api'
import { getReviewsByRecipeId } from '../api/review'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { UserAuth } from '@/context/AuthContext'

function RecipePages() {
    const { slug } = useParams<{ slug: string }>()
    const { session } = UserAuth()

    const { data: recipeData, isLoading} = useQuery({
        queryKey: ['recipe', slug],
        queryFn: () => getRecipeBySlug(slug!),
    })

    const { data: reviews = [] } = useQuery({
        queryKey: ['reviews', recipeData?.id],
        queryFn: () => getReviewsByRecipeId(recipeData!.id!),
        enabled: !!recipeData?.id,
    })

    const userReview = reviews.find(r => r.user_id === session?.user.id) ?? null
    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : undefined

    const [portions, setPortions] = useState(1)

    // Update portions when recipeData becomes available
    useEffect(() => {
        if (recipeData?.servings) {
            setPortions(recipeData.servings)
        }
    }, [recipeData?.servings])

    return (
        <>
            {recipeData && (
                <Helmet>
                    <title>{recipeData.title} — SarjoMat</title>
                    <meta name="description" content={recipeData.description} />
                    <meta property="og:title" content={recipeData.title} />
                    <meta property="og:description" content={recipeData.description} />
                    <meta property="og:image" content={recipeData.image_url} />
                    <meta property="og:url" content={`https://sarjomat.no/oppskrifter/${recipeData.slug ?? slug}`} />
                    <link rel="canonical" href={`https://sarjomat.no/oppskrifter/${recipeData.slug ?? slug}`} />
                    <script type="application/ld+json">{JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Recipe",
                        "name": recipeData.title,
                        "description": recipeData.description,
                        "image": recipeData.image_url,
                        "author": { "@type": "Person", "name": "Daniel Sarjomaa" },
                        "datePublished": recipeData.created_at,
                        "recipeCuisine": recipeData.cuisine,
                        "recipeCategory": recipeData.meal_type,
                        "recipeYield": `${recipeData.servings} porsjoner`,
                        "cookTime": `PT${recipeData.cook_time}M`,
                        ...(recipeData.tags && recipeData.tags.length > 0 && {
                            "keywords": recipeData.tags.map(t => t.name).join(', ')
                        }),
                        "recipeIngredient": recipeData.ingredients.map(
                            i => `${i.amount} ${i.unit} ${i.name}`.trim()
                        ),
                        "recipeInstructions": [...recipeData.steps]
                            .sort((a, b) => a.stepNumber - b.stepNumber)
                            .map(s => ({
                                "@type": "HowToStep",
                                "text": s.instruction
                            })),
                        ...(recipeData.nutrition && {
                            "nutrition": {
                                "@type": "NutritionInformation",
                                "calories": `${recipeData.nutrition.calories} calories`,
                                "proteinContent": `${recipeData.nutrition.protein}g`,
                                "carbohydrateContent": `${recipeData.nutrition.carbohydrates}g`,
                                "fatContent": `${recipeData.nutrition.fat}g`,
                                "fiberContent": `${recipeData.nutrition.fiber}g`,
                            }
                        }),
                        ...(avgRating !== undefined && reviews.length > 0 && {
                            "aggregateRating": {
                                "@type": "AggregateRating",
                                "ratingValue": avgRating.toFixed(1),
                                "reviewCount": reviews.length,
                                "bestRating": "5",
                                "worstRating": "1"
                            }
                        })
                    })}</script>
                </Helmet>
            )}
            <div className=''><NavigationBar/></div>
            
            <div className='flex flex-col md:flex-row md:flex-wrap md:justify-center'>
                <div className='w-full flex justify-center'>
                    {isLoading
                        ? <div className='mb-4 md:mb-10 md:my-10 md:w-2/5 aspect-[16/9] bg-gray-300 animate-pulse rounded-2xl' />
                        : recipeData && <img src={recipeData.image_url} alt={recipeData.title} className='mb-4 md:mb-10 md:my-10 md:w-2/5 object-cover rounded-2xl'/>
                    }
                </div>

                {/* On mobile: contents dissolves this wrapper so children can be ordered freely */}
                {/* On desktop: restored as the original left column */}
                <div className='contents md:flex md:flex-col md:w-1/2'>
                    <div className='order-1 md:order-none'>
                        {isLoading ? <TitleInstructionCardSkeleton /> : recipeData && <TitleInstructionCards recipe={recipeData} avgRating={avgRating} reviewCount={reviews.length} />}
                    </div>
                    <div className='order-last md:order-none'>
                        {recipeData && <Reviews recipeId={recipeData.id!} reviews={reviews} userReview={userReview} />}
                    </div>
                </div>

                {/* Right column */}
                <div className='order-2 md:order-none flex flex-col'>
                    {isLoading ? <IngredientsCardSkeleton /> : recipeData && <IngredientsCard recipe={recipeData} portions={portions} setPortions={setPortions} />}
                    {isLoading ? <NutritionCardSkeleton /> : recipeData && <NutritionCard recipe={recipeData} portions={portions} />}
                </div>
            </div>
        </>
    )
}

export default RecipePages