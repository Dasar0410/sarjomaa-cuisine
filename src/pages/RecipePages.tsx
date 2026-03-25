import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import NavigationBar from '../components/NavigationBar'
import TitleInstructionCards from '../components/TitleInstructionCard'
import IngredientsCard from '../components/IngredientsCard'
import NutritionCard from '../components/NutritionCard'
import { getRecipeBySlug } from '../api/api'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

function RecipePages() {
    const { slug } = useParams<{ slug: string }>()

    const { data: recipeData} = useQuery({
        queryKey: ['recipe', slug],
        queryFn: () => getRecipeBySlug(slug!),
    })

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
                    <title>{recipeData.title} — Sarjomaa Cuisine</title>
                    <meta name="description" content={recipeData.description} />
                    <meta property="og:title" content={recipeData.title} />
                    <meta property="og:description" content={recipeData.description} />
                    <meta property="og:image" content={recipeData.image_url} />
                    <meta property="og:url" content={`https://sarjomaa.no/oppskrifter/${recipeData.slug ?? slug}`} />
                    <link rel="canonical" href={`https://sarjomaa.no/oppskrifter/${recipeData.slug ?? slug}`} />
                    <script type="application/ld+json">{JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Recipe",
                        "name": recipeData.title,
                        "description": recipeData.description,
                        "image": recipeData.image_url,
                        "author": { "@type": "Person", "name": recipeData.creator },
                        "datePublished": recipeData.created_at,
                        "recipeCuisine": recipeData.cuisine,
                        "recipeCategory": recipeData.meal_type,
                        "recipeYield": `${recipeData.servings} porsjoner`,
                        "cookTime": `PT${recipeData.cook_time}M`,
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
                        })
                    })}</script>
                </Helmet>
            )}
            <div className=''><NavigationBar/></div>
            
            <div className=' flex flex-row flex-wrap justify-center'>
                <div className='w-full flex justify-center'>
                    {recipeData && <img src={recipeData.image_url} alt={recipeData.title} className='mb-10 md:my-10 md:w-2/4 object-cover'/>}
                </div>
                
                {/* Left column: TitleInstructionCards */}
                {recipeData && <TitleInstructionCards recipe={recipeData} />}
                
                {/* Right column: IngredientsCard and NutritionCard stacked */}
                <div className='flex flex-col'>
                    {recipeData && <IngredientsCard recipe={recipeData} portions={portions} setPortions={setPortions} />}
                    {recipeData && <NutritionCard recipe={recipeData} portions={portions} />}
                </div>
            </div>
        </>
    )
}

export default RecipePages