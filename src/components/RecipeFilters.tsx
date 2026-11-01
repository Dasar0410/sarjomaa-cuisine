import { X } from 'lucide-react';
import { Recipe, Tag } from '../types/recipe';
import { Button } from './ui/button';
import { RecipeFilterState, emptyFilters, hasActiveFilters } from '../lib/recipeFilters';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';

// Radix Select does not allow an empty string as value, so "alle" means no filter
const ALL = 'alle';

const ratingOptions = [4, 3, 2, 1];

// Collect the distinct values present in the recipes, keeping any selected value visible
function uniqueValues(values: (string | undefined)[], selected: string | null) {
    const set = new Set(values.filter((v): v is string => !!v));
    if (selected) set.add(selected);
    return [...set].sort((a, b) => a.localeCompare(b, 'nb'));
}

interface RecipeFiltersProps {
    recipes: Recipe[]
    filters: RecipeFilterState
    onChange: (filters: RecipeFilterState) => void
}

function RecipeFilters({ recipes, filters, onChange }: RecipeFiltersProps) {
    const cuisines = uniqueValues(recipes.map(r => r.cuisine), filters.cuisine);
    const mealTypes = uniqueValues(recipes.map(r => r.meal_type), filters.mealType);

    const tagMap = new Map<number, Tag>();
    recipes.forEach(r => r.tags?.forEach(tag => tagMap.set(tag.id, tag)));
    const tags = [...tagMap.values()].sort((a, b) => a.slug_text.localeCompare(b.slug_text, 'nb'));

    const toggleTag = (id: number) => {
        const tagIds = filters.tagIds.includes(id)
            ? filters.tagIds.filter(t => t !== id)
            : [...filters.tagIds, id];
        onChange({ ...filters, tagIds });
    };

    return (
        <div className='max-w-7xl mx-auto px-4 mb-2'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                <Select
                    value={filters.mealType ?? ALL}
                    onValueChange={value => onChange({ ...filters, mealType: value === ALL ? null : value })}
                >
                    <SelectTrigger className='bg-card' aria-label='Type rett'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Alle typer retter</SelectItem>
                        {mealTypes.map(type => (
                            <SelectItem key={type} value={type} className='capitalize'>{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.cuisine ?? ALL}
                    onValueChange={value => onChange({ ...filters, cuisine: value === ALL ? null : value })}
                >
                    <SelectTrigger className='bg-card' aria-label='Kjøkken'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Alle kjøkken</SelectItem>
                        {cuisines.map(cuisine => (
                            <SelectItem key={cuisine} value={cuisine} className='capitalize'>{cuisine}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.minRating !== null ? String(filters.minRating) : ALL}
                    onValueChange={value => onChange({ ...filters, minRating: value === ALL ? null : Number(value) })}
                >
                    <SelectTrigger className='bg-card' aria-label='Vurdering'>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Alle vurderinger</SelectItem>
                        {ratingOptions.map(rating => (
                            <SelectItem key={rating} value={String(rating)}>{rating}+ stjerner</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-4'>
                    {tags.map(tag => {
                        const active = filters.tagIds.includes(tag.id);
                        return (
                            <button
                                key={tag.id}
                                type='button'
                                aria-pressed={active}
                                onClick={() => toggleTag(tag.id)}
                                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-brand-primary text-brand-primary-foreground'
                                        : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'
                                }`}
                            >
                                {tag.slug_text}
                            </button>
                        );
                    })}
                </div>
            )}

            {hasActiveFilters(filters) && (
                <div className='mt-4'>
                    <Button variant='ghost' size='sm' onClick={() => onChange(emptyFilters)}>
                        <X />
                        Nullstill filtre
                    </Button>
                </div>
            )}
        </div>
    );
}

export default RecipeFilters;
