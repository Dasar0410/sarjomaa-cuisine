
import { useEffect, useState } from 'react';
import NavigationBar from '../components/NavigationBar';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types/recipe';
import LandingPage from '../components/LandingPage';
import { Link } from 'react-router-dom';
import * as api from '../api/api';

function Home() {
    const [recipes, setRecipes] = useState<Recipe[]>([]); // set initial state to empty array
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
        <div className=''>
            <NavigationBar />
            <LandingPage />
            {/* make card under clickable and lead to the recipepage containing info on the recipe clicked  */}
            
            <div className='text-3xl text-center '>
            <div className='justify-center' id='recipes'>
            <h2 className='md:text-5xl text-3xl font-bold mb-4 text-brand-primary'>Nyeste Oppskrifter</h2>
                <div className='bg-secondary md:text-secondary-foreground p-4 md:p-8 pb-12 rounded-3xl shadow-2xl'>
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
                </div>

            </div>
            </div>
        </div>
    );
}

export default Home;