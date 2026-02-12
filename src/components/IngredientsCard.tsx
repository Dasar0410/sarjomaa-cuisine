import {Recipe} from '../types/recipe'
import { Undo2 } from 'lucide-react'

interface IngredientsCardProps {
    recipe: Recipe;
    portions: number;
    setPortions: (portions: number) => void;
}

function IngredientsCard({recipe, portions, setPortions}: IngredientsCardProps) {
    const portionMultiplier = portions / recipe.servings;

    return (
        <div className='card h-fit p-10 mb-8 shadow-lg rounded-xl mx-4 md:mx-0 bg-white'>
            {/* Header with title and portions control */}
            <div className='mb-6 pb-4 border-b'>
                <h3 className='text-2xl font-semibold mb-3'>Ingredienser</h3>
                
                {/* Portions control */}
                <div className='flex items-center gap-3'>
                    <span className='text-base font-medium text-gray-600'>Porsjoner:</span>
                    <div className='flex items-center gap-2'>
                        <button 
                            onClick={() => setPortions(Math.max(1, portions - 1))}
                            className='w-8 h-8 rounded-full bg-brand-primary text-white hover:bg-brand-primary/80 transition-colors flex items-center justify-center font-bold'
                        >
                            −
                        </button>
                        <span className='text-xl font-semibold min-w-[2rem] text-center'>{portions}</span>
                        <button 
                            onClick={() => setPortions(portions + 1)}
                            className='w-8 h-8 rounded-full bg-brand-primary text-white hover:bg-brand-primary/80 transition-colors flex items-center justify-center font-bold'
                        >
                            +
                        </button>
                        {/* Reserve space for undo button to prevent layout shift */}
                        <div className='w-8 ml-1 flex items-center'>
                            {portions !== recipe.servings && (
                                <button 
                                    onClick={() => setPortions(recipe.servings)}
                                    className='text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center justify-center'
                                    title='Tilbakestill til original'
                                >
                                    <Undo2 size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ul className='space-y-2 capitalize'>
                {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className='flex items-center gap-2'>
                    <input className='' type="checkbox"  name={ingredient.name} value={ingredient.amount}></input>
                    <label key={index}> 
                        {ingredient.name} - {(ingredient.amount * portionMultiplier).toFixed(1)} <span className='normal-case'>{ingredient.unit}</span>
                    </label>
                    </div>
                ))}
            </ul>
        </div>
    )
}

export default IngredientsCard