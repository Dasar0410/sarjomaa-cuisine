import { useEffect, useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types/recipe';
import LandingPage from '../components/LandingPage';
import { Link, useNavigate } from 'react-router-dom';
import * as api from '../api/api';
import { Button } from '../components/ui/button';

function Home() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const navigate = useNavigate();
    // const searchterm functionality tba

    const fetchRecipes = async () => {
        const data = await api.getRecipes();
        // This is a horrible solution, replace with a proper query that sorts by created_at
        const sortedRecipes = data.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setRecipes(sortedRecipes.slice(0, 4));
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <div className='leading-none'>
            <NavigationBar />
            <LandingPage />
            {/* make card under clickable and lead to the recipepage containing info on the recipe clicked  */}
            
            <div className='text-3xl text-center bg-brand-primary leading-none'>
            <div className='justify-center' id='recipes'>
                <div className=' md:text-secondary-foreground p-4 md:p-8 pt-12'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8'>
                {recipes.map((recipe) => (
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
                <div className="mt-12 mb-6">
                    <Button 
                        variant="secondary" 
                        size="lg" 
                        className="md:text-2xl text-lg px-10 py-6 bg-brand-primary-foreground text-brand-primary hover:bg-brand-background transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        onClick={() => navigate('/recipes')}
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