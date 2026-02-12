import { Recipe } from '../types/recipe';

interface NutritionCardProps {
  recipe: Recipe;
}

function NutritionCard({ recipe }: NutritionCardProps) {
  // Don't render if no nutrition data
  if (!recipe.nutrition || recipe.nutrition.calories === 0) {
    return null;
  }

  const { nutrition, servings } = recipe;

  return (
    <div className='card h-fit mx-4 md:mx-0 p-10 mb-8 shadow-lg rounded-xl bg-white'>
      <h3 className='text-2xl font-semibold mb-4'>Næringsinformasjon</h3>
      <p className='text-sm text-gray-600 mb-4'>Per porsjon ({servings} porsjoner totalt)</p>
      
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

        {/* Total nutrition info note */}
        <p className='text-xs text-gray-500 mt-4 pt-4 border-t'>
          * Verdiene er per porsjon. Total oppskrift inneholder {nutrition.calories} kcal.
        </p>
      </div>
    </div>
  );
}

export default NutritionCard;
