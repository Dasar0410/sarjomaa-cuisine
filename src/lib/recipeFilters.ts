import { Recipe } from '../types/recipe';

export interface RecipeFilterState {
    cuisine: string | null
    mealType: string | null
    minRating: number | null
    tagIds: number[]
}

export const emptyFilters: RecipeFilterState = {
    cuisine: null,
    mealType: null,
    minRating: null,
    tagIds: [],
};

export function hasActiveFilters(filters: RecipeFilterState) {
    return filters.cuisine !== null
        || filters.mealType !== null
        || filters.minRating !== null
        || filters.tagIds.length > 0;
}

export function applyFilters(recipes: Recipe[], filters: RecipeFilterState): Recipe[] {
    return recipes.filter(recipe => {
        if (filters.cuisine && recipe.cuisine !== filters.cuisine) return false;
        if (filters.mealType && recipe.meal_type !== filters.mealType) return false;
        if (filters.minRating !== null) {
            if (!recipe.review_count || recipe.avg_rating === undefined) return false;
            if (recipe.avg_rating < filters.minRating) return false;
        }
        if (filters.tagIds.length > 0) {
            const recipeTagIds = recipe.tags?.map(tag => tag.id) ?? [];
            if (!filters.tagIds.every(id => recipeTagIds.includes(id))) return false;
        }
        return true;
    });
}
