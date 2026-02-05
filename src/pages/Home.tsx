import NavigationBar from '../components/NavigationBar';
import RecipeCard from '../components/RecipeCard';
import LandingPage from '../components/LandingPage';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../api/api';
import { Button } from '../components/ui/button';
import {
    useQuery
  } from '@tanstack/react-query'


function Home() {
    const navigate = useNavigate();
    const { data} = useQuery({
        queryKey: ['recipes'],
        queryFn: api.getRecipes,
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
                <div className=' md:text-secondary-foreground p-4 md:p-8 pt-12'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
                {displayRecipes.map((recipe) => (
                    <Link 
                    key={recipe.id} 
                    to={`/recipes/${recipe.id}`} 
                    className="block h-full"
                    >
                    <div className="h-full">
                    <RecipeCard recipe={recipe} />
                    </div>
                    </Link>
                ))}
                </div>
                
                {/* Se alle oppskrifter button */}
                <div className="mt-12 mb-16">
                    <Button 
                        variant="secondary" 
                        size="lg" 
                        className="text-lg px-10 py-6 bg-brand-primary-foreground text-brand-primary hover:bg-brand-background transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        onClick={() => {
                            navigate('/recipes');
                            window.scrollTo({ top: 0 });
                        }}
                    >
                        Se alle oppskrifter →
                    </Button>
                </div>
                
                </div>

            </div>
            </div>
        </div>
    );
}

export default Home;