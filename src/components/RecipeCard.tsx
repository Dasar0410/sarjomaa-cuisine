import { Recipe } from '../types/recipe'

const getSpiceLevel = (spiceLevel: string) => {
  if (!spiceLevel) return '';
  const level = spiceLevel.toLowerCase();
  if (level === 'mild') return '';
  if (level === 'medium') return '🌶️';
  if (level === 'spicy') return '🌶️🌶️';
  return '';
};

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="bg-white w-full h-full rounded-2xl overflow-hidden shadow-md border border-brand-border/30 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group flex flex-col">
      <div className="relative overflow-hidden h-40 md:h-56 flex-shrink-0">
        <img 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          src={recipe.image_url} 
          alt={recipe.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="px-3 py-3 md:px-6 md:py-5 flex flex-col flex-grow"> 
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <h3 className="font-bold text-lg md:text-2xl text-brand-foreground capitalize">
            {recipe.title}
          </h3>
          <span className="text-base md:text-lg">
            {getSpiceLevel(recipe.spice_level)}
          </span>
        </div>
        <p className="text-brand-foreground/70 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 flex-grow">
          {recipe.description}
        </p>
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.tags.map(tag => (
              <span 
                key={tag.id} 
                className="inline-flex items-center bg-brand-primary/10 text-brand-primary rounded-md px-2 py-0.5 text-sm font-medium"
              >
                {tag.slug_text}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-brand-border/20 mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center bg-brand-secondary/60 text-brand-foreground rounded-full px-2 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-semibold capitalize">
              {recipe.cuisine}
            </span>
            <span className="inline-flex items-center bg-brand-secondary/40 text-brand-foreground rounded-full px-2 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-semibold capitalize">
               {recipe.meal_type}
            </span>
            <span className="inline-flex items-center bg-brand-secondary/20 text-brand-foreground rounded-full px-2 py-1 md:px-4 md:py-1.5 text-xs md:text-sm font-semibold">
              &lt; {recipe.cook_time} min
            </span>
          </div>
          <svg 
            className="w-4 h-4 md:w-5 md:h-5 text-brand-primary transform transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  )}
  export default RecipeCard;
