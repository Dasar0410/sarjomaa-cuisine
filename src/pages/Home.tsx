import NavigationBar from '../components/NavigationBar';
import RecipeCard from '../components/RecipeCard';
import LandingPage from '../components/LandingPage';
import { Link, useNavigate } from 'react-router-dom';
import { searchRecipes } from '../api/api';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import {
    useQuery
  } from '@tanstack/react-query'


function Home() {
    const navigate = useNavigate();
    const [searchTerm] = useState<string>('');

    const { data} = useQuery({
        queryKey: ['recipes', searchTerm],
        queryFn: () => searchRecipes(searchTerm),
    });

    // Get only the 4 newest recipes sorted by created_at
    const displayRecipes = data
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4) || [];

    return (
        <div className='leading-none'>
            <NavigationBar />
            <LandingPage />
            {/* make card under clickable and lead to the recipepage containing info on the recipe clicked  */}
            
            <div className='text-3xl text-center bg-brand-primary leading-none'>
            <div className='justify-center' id='recipes'>
                <div className=' md:text-secondary-foreground px-8'>
                <p className='text-left text-xl font-semibold uppercase tracking-widest text-brand-primary-foreground/60 mb-4'>Nyeste oppskrifter</p>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-'>
                {displayRecipes.map((recipe) => (
                    <Link 
                    key={recipe.id} 
                    to={`/oppskrifter/${recipe.slug}`}
                    className="block h-full"
                    >
                    <div className="">
                    <RecipeCard recipe={recipe} />
                    </div>
                    </Link>
                ))}
                </div>
                
                </div>

            </div>
            </div>
        </div>
    );
}

export default Home;