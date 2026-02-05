import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar'
import FilterSearch from '../components/FilterSearch';
import { searchRecipes } from '../api/api';
import { useQuery } from '@tanstack/react-query';

function AllRecipes() {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const { data: recipes = [] } = useQuery({
        queryKey: ['recipes', searchTerm],
        queryFn: () => searchRecipes(searchTerm),
    });

    const onSearchChange = (term: string) => {
        setSearchTerm(term);
    };

    return (
        <div> 
            <NavigationBar />
            <FilterSearch onSearchChange={onSearchChange} />
            <div className='card-container columns-2 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-4 2xl:columns-5  gap-4 md:gap-6 px-4 py-4 space-y-4'>
            {recipes.map((recipe) => (
                <Link 
                key={recipe.id} 
                to={`/recipes/${recipe.id}`} 
                className="block mb-4 md:mb-6 break-inside-avoid"
                >
                <RecipeCard recipe={recipe} />
                </Link>
            ))}
            </div>
        
        </div>
    )
}

export default AllRecipes