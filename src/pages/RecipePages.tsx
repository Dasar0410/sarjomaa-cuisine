import { useParams } from 'react-router-dom'
import NavigationBar from '../components/NavigationBar'
import TitleInstructionCards from '../components/TitleInstructionCard'
import IngredientsCard from '../components/IngredientsCard'
import NutritionCard from '../components/NutritionCard'
import { getRecipeById } from '../api/api'
import { useQuery } from '@tanstack/react-query'

function RecipePages() {
    const {id} = useParams<{ id: string}>()

    const { data: recipeData} = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => getRecipeById(Number(id)),
    })

    return (
        <>
            <div className=''><NavigationBar/></div>
            
            <div className=' flex flex-row flex-wrap justify-center'>
                <div className='w-full flex justify-center'>
                    {recipeData && <img src={recipeData.image_url} alt={recipeData.title} className='mb-10 md:my-10 md:w-2/4 object-cover'/>}
                </div>
                
                {/* Left column: TitleInstructionCards */}
                {recipeData && <TitleInstructionCards recipe={recipeData} />}
                
                {/* Right column: IngredientsCard and NutritionCard stacked */}
                <div className='flex flex-col'>
                    {recipeData && <IngredientsCard recipe={recipeData} />}
                    {recipeData && <NutritionCard recipe={recipeData} />}
                </div>
            </div>
        </>
    )
}

export default RecipePages