import NavigationBar from '../components/NavigationBar';
import RecipeCard from '../components/RecipeCard';
import LandingPage from '../components/LandingPage';
import { Link, useNavigate } from 'react-router-dom';
import { searchRecipes } from '../api/api';
import { Button } from '../components/ui/button';
import { Skeleton } from 'boneyard-js/react'
import { useState } from 'react';
import {
    useQuery
  } from '@tanstack/react-query'


function Home() {
    const navigate = useNavigate();
    const [searchTerm] = useState<string>('');

    const { data, isLoading} = useQuery({
        queryKey: ['recipes', searchTerm],
        queryFn: () => searchRecipes(searchTerm),
    });

    // Get only the 4 newest recipes sorted by created_at
    const displayRecipes = data?.slice(0, 6) || [];

    return (
        <div className='leading-none'>
            <NavigationBar />
            <LandingPage />
            {/* make card under clickable and lead to the recipepage containing info on the recipe clicked  */}

            <div className=' bg-brand-primary'>
            <div className='justify-center' id='recipes'>
                <div className='md:text-secondary-foreground p-4 md:p-8 pt-12 max-w-7xl mx-auto'>
                <div className='columns-2 md:columns-2 xl:columns-3'>
                {displayRecipes.map((recipe) => (
                    <Link
                    key={recipe.id}
                    to={`/oppskrifter/${recipe.slug}`}
                    className="block break-inside-avoid mb-4 md:mb-6"
                    >
                    <Skeleton name="recipe-card" loading={isLoading}>
                    <RecipeCard recipe={recipe} />
                    </Skeleton>
                    </Link>
                ))}
                </div>

                {/* Se alle oppskrifter button */}
                <div className="mt-12 mb-16 flex justify-center">
                    <Button 
                        variant="secondary" 
                        size="lg" 
                        className="text-lg align px-10 py-6 bg-brand-primary-foreground text-brand-primary hover:bg-brand-background transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        onClick={() => navigate('/oppskrifter')}
                    >
                        Se flere oppskrifter →
                    </Button>
                </div>
                </div>

            </div>
            </div>
        </div>
    );
}

export default Home;
