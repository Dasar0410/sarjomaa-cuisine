import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Recipe } from '../types/recipe'
import NavigationBar from '../components/NavigationBar'
import TitleInstructionCards from '../components/TitleInstructionCard'
import IngredientsCard from '../components/IngredientsCard'
import { getRecipeById } from '../api/api'
import { useQuery } from '@tanstack/react-query'
function RecipePages() {
    const {id} = useParams<{ id: string}>() // recipes/:id

    const { data: recipeData} = useQuery({
        queryKey: ['recipe', id],
        queryFn: () => getRecipeById(Number(id)),
    })

    return (
        <>
            <div className=''><NavigationBar/></div>
            <div className='md:mx-10 flex flex-row flex-wrap justify-center'>
                <div className='w-full flex justify-center'>
                {recipeData && <img src={recipeData.image_url} alt={recipeData.title} className='mb-10 md:my-10 md:w-2/4  object-cover'/>}
                </div>
            {recipeData && <TitleInstructionCards recipe={recipeData} />}
            {recipeData && <IngredientsCard recipe={recipeData} />}
            </div>
        </>
    )
}

export default RecipePages