import { Helmet } from 'react-helmet-async';
import { useMemo, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar'
import FilterSearch from '../components/FilterSearch';
import RecipeFilters from '../components/RecipeFilters';
import { RecipeFilterState, emptyFilters, applyFilters, hasActiveFilters } from '../lib/recipeFilters';
import { searchRecipes } from '../api/api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import RecipeCardSkeleton from '../skeletons/RecipeCardSkeleton';

function AllRecipes() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filters, setFilters] = useState<RecipeFilterState>(emptyFilters);

    const { data: recipes = [], isLoading } = useQuery({
        queryKey: ['recipes', searchTerm],
        queryFn: () => searchRecipes(searchTerm),
        placeholderData: keepPreviousData,
    });

    const filteredRecipes = useMemo(() => applyFilters(recipes, filters), [recipes, filters]);

    const onSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    return (
        <div>
            <Helmet>
                <title>Alle oppskrifter — SarjoMat</title>
                <meta name="description" content="Utforsk alle oppskrifter på SarjoMat. Søk og filtrer blant enkle og gode middagsretter." />
                <meta property="og:title" content="Alle oppskrifter — SarjoMat" />
                <meta property="og:description" content="Utforsk alle oppskrifter på SarjoMat. Søk og filtrer blant enkle og gode middagsretter." />
                <meta property="og:image" content="https://sarjomat.no/sarjomat.png" />
                <meta property="og:url" content="https://sarjomat.no/oppskrifter" />
                <link rel="canonical" href="https://sarjomat.no/oppskrifter" />
            </Helmet>
            <NavigationBar />
            <FilterSearch onSearchChange={onSearchChange} />
            <RecipeFilters recipes={recipes} filters={filters} onChange={setFilters} />
            {!isLoading && filteredRecipes.length === 0 && (
                <div className='text-center text-brand-foreground/70 px-4 py-12'>
                    <p className='text-lg'>Ingen oppskrifter matcher søket ditt.</p>
                    {hasActiveFilters(filters) && (
                        <button
                            type='button'
                            onClick={() => setFilters(emptyFilters)}
                            className='mt-2 text-brand-primary underline underline-offset-4'
                        >
                            Nullstill filtre
                        </button>
                    )}
                </div>
            )}
            <div className='card-container columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-3  gap-4 md:gap-6 px-4 py-4 space-y-4 max-w-7xl mx-auto'>
            {isLoading && recipes.length === 0
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="block mb-4 md:mb-6 break-inside-avoid">
                        <RecipeCardSkeleton />
                    </div>
                ))
                : filteredRecipes.map((recipe) => (
                    <Link
                        key={recipe.id}
                        to={`/oppskrifter/${recipe.slug}`}
                        className="block mb-4 md:mb-6 break-inside-avoid"
                    >
                        <RecipeCard recipe={recipe} />
                    </Link>
                ))
            }
            </div>
        
        </div>
    )
}

export default AllRecipes