import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar'
import FilterSearch from '../components/FilterSearch';
import { searchRecipes } from '../api/api';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import RecipeCardSkeleton from '../skeletons/RecipeCardSkeleton';

function AllRecipes() {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const { data: recipes = [], isLoading } = useQuery({
        queryKey: ['recipes', searchTerm],
        queryFn: () => searchRecipes(searchTerm),
        placeholderData: keepPreviousData,
    });

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
            <div className='card-container columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-3  gap-4 md:gap-6 px-4 py-4 space-y-4 max-w-7xl mx-auto'>
            {isLoading && recipes.length === 0
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="block mb-4 md:mb-6 break-inside-avoid">
                        <RecipeCardSkeleton />
                    </div>
                ))
                : recipes.map((recipe) => (
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