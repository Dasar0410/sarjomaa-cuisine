import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteRecipe } from '../api/api';
import supabase from '../api/supabase';
import { Recipe } from '../types/recipe';

export function useDeleteRecipe() {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async (recipeData: Recipe, id: number) => {
    const confirmDelete = window.confirm(
      `Er du sikker på at du vil slette "${recipeData.title}"? Dette kan ikke angres.`
    );
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Delete the image from storage
      if (recipeData.image_url) {
        const imagePath = recipeData.image_url.split('/recipe-images/')[1];
        if (imagePath) {
          await supabase.storage
            .from('recipe-images')
            .remove([imagePath]);
        }
      }
      
      // Delete the recipe from database
      await deleteRecipe(id);
      
      alert('Oppskriften ble slettet!');
      navigate('/recipes');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Kunne ikke slette oppskriften. Prøv igjen.');
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
}
