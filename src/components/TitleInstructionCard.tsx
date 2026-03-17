import { useMemo } from 'react';
import { Recipe } from '../types/recipe';
import { UserAuth } from '@/context/AuthContext';
import { Edit } from 'lucide-react';
import { highlightIngredients } from '@/lib/highlightIngredients';

function TitleInstructionCards({ recipe }: { recipe: Recipe }){

const isAdmin = UserAuth().session?.user.id === import.meta.env.VITE_ADMIN_USER_ID;

const ingredientNames = useMemo(
    () => recipe.ingredients.map(i => i.name).filter(name => name.length >= 3),
    [recipe.ingredients]
);

return(

<section className="shadow-lg p-8 md:mx-8 mb-8 mx-4 justify-center rounded-2xl bg-white w-full lg:w-1/2 h-fit ">
    <div className=' leading-loose'>
        <div className='flex flex-col items-center text-center'>

        <h1 className='text-5xl mb-8 mt-8 font-bold capitalize'>{recipe.title}

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