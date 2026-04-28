import { useMemo } from 'react';
import { Recipe } from '../types/recipe';
import { UserAuth } from '@/context/AuthContext';
import { Edit } from 'lucide-react';
import { highlightIngredients } from '@/lib/highlightIngredients';
import { getEnv } from '@/lib/env';
import StarRating from './StarRating';

interface TitleInstructionCardsProps {
  recipe: Recipe
  avgRating?: number
  reviewCount?: number
}

function TitleInstructionCards({ recipe, avgRating, reviewCount }: TitleInstructionCardsProps){

const isAdmin = UserAuth().session?.user.id === getEnv('VITE_ADMIN_USER_ID', 'NEXT_PUBLIC_ADMIN_USER_ID');

const ingredientNames = useMemo(
    () => recipe.ingredients.map(i => i.name).filter(name => name.length >= 3),
    [recipe.ingredients]
);

return(

<section className="shadow-lg p-8 md:mx-8 mb-8 mx-4 justify-center rounded-2xl bg-white h-fit ">
    <div className=' leading-loose'>
        <div className='flex flex-col items-center text-center'>

        <h1 className='text-5xl mb-4 md:mt-8 mt-4 font-bold capitalize'>{recipe.title}

        {isAdmin && (
            <a
                href={`/admin/edit-recipe/${recipe.id}`}
                className=" pl-4"
            >
                <Edit className='inline-block '
                size={32}
                />
            </a>
        )}
        </h1>

        {avgRating !== undefined && reviewCount !== undefined && reviewCount > 0 && (
          <div className='flex items-center gap-2 mb-6'>
            <StarRating value={avgRating} size={20} />
            <span className='text-gray-600 text-sm mb-1.5'>{avgRating.toFixed(1)} ({reviewCount})</span>
          </div>
        )}

        <p className='text-2xl text-gray-800 mb-8'>{recipe.description}</p>
        </div>
        <h2 className="text-2xl font-semibold mt-8 mb-4 ml-4">Instruksjoner</h2>
        <ol className='list-decimal ml-4 space-y-6'>
        {recipe.steps.map((step) => (
            <li key={step.stepNumber} className='ml-4 leading-relaxed'>{highlightIngredients(step.instruction, ingredientNames)}</li>
        ))}
            </ol>
    </div>
</section>
)
}

export default TitleInstructionCards;