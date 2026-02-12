import { Recipe } from '../types/recipe';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface NutritionCardProps {
  recipe: Recipe;
  portions: number;
}

function NutritionCard({ recipe, portions }: NutritionCardProps) {
  const [showTotal, setShowTotal] = useState(false);

  // Don't render if no nutrition data
  if (!recipe.nutrition || recipe.nutrition.calories === 0) {
    return null;
  }

  const { nutrition, servings } = recipe;
  const portionMultiplier = portions / servings;

  return (
    <div className='card h-fit mx-4 md:mx-0 p-10 mb-8 shadow-lg rounded-xl bg-white'>
      <h3 className='text-2xl font-semibold mb-4'>Næringsinformasjon</h3>
      <p className='text-sm text-gray-600 mb-4'>Per porsjon ({portions} porsjoner valgt)</p>
      
      <div className='space-y-3'>
        {/* Calories */}
        <div className='flex justify-between items-center py-2 border-b'>
          <span className='font-medium text-lg'>Kalorier</span>
          <span className='text-lg font-semibold text-brand-primary'>
            {Math.round(nutrition.calories / servings)} kcal
          </span>
        </div>

        {/* Macronutrients */}
        <div className='grid grid-cols-2 gap-4 pt-2'>
          <div className='bg-brand-background/30 p-4 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Protein</p>
            <p className='text-xl font-semibold text-brand-foreground'>
              {(nutrition.protein / servings).toFixed(1)}g
            </p>
          </div>

          <div className='bg-brand-background/30 p-4 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Karbohydrater</p>
            <p className='text-xl font-semibold text-brand-foreground'>
              {(nutrition.carbohydrates / servings).toFixed(1)}g
            </p>
          </div>

          <div className='bg-brand-background/30 p-4 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Fett</p>
            <p className='text-xl font-semibold text-brand-foreground'>
              {(nutrition.fat / servings).toFixed(1)}g
            </p>
          </div>

          <div className='bg-brand-background/30 p-4 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Fiber</p>
            <p className='text-xl font-semibold text-brand-foreground'>
              {(nutrition.fiber / servings).toFixed(1)}g
            </p>
          </div>
        </div>

        {/* Total nutrition dropdown */}
        <div className='mt-6 pt-4 border-t'>
          <button 
            onClick={() => setShowTotal(!showTotal)}
            className='w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-brand-primary transition-colors'
          >
            <span>Totalt for {portions} porsjoner</span>
            {showTotal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showTotal ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
            }`}
          >
            <div className='bg-brand-primary/10 p-4 rounded-lg space-y-2'>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-700'>Kalorier:</span>
                <span className='text-sm font-semibold text-brand-foreground'>
                  {Math.round(nutrition.calories * portionMultiplier)} kcal
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-700'>Protein:</span>
                <span className='text-sm font-semibold text-brand-foreground'>
                  {(nutrition.protein * portionMultiplier).toFixed(1)}g
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-700'>Karbohydrater:</span>
                <span className='text-sm font-semibold text-brand-foreground'>
                  {(nutrition.carbohydrates * portionMultiplier).toFixed(1)}g
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-700'>Fett:</span>
                <span className='text-sm font-semibold text-brand-foreground'>
                  {(nutrition.fat * portionMultiplier).toFixed(1)}g
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-sm text-gray-700'>Fiber:</span>
                <span className='text-sm font-semibold text-brand-foreground'>
                  {(nutrition.fiber * portionMultiplier).toFixed(1)}g
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Original recipe info note */}
        <p className='text-xs text-gray-500 mt-4 pt-4 border-t'>
          * Original oppskrift er for {servings} porsjoner med {nutrition.calories} kcal totalt.
        </p>
      </div>
    </div>
  );
}

export default NutritionCard;
