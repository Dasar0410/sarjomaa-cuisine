import NavigationBar from "@/components/NavigationBar"
import { Recipe, Ingredient, RecipeNutrition } from '@/types/recipe';
import { updateRecipe as updateRecipe, getRecipeById, addNutrition, updateNutrition, deleteNutrition } from '@/api/api';
import supabase from '@/api/supabase';
import imageCompression from "browser-image-compression";
import { UserAuth } from '@/context/AuthContext';
import RecipeForm from './RecipeForm';
import { useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useDeleteRecipe } from '@/hooks/useDeleteRecipe';

function EditRecipe() {
  const { session } = UserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleDelete, isDeleting } = useDeleteRecipe();

  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(Number(id)),
    enabled: !!id,
  });

  async function compressRecipeImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: "image/webp" as const,
      initialQuality: 0.8,
    };

    const compressed = await imageCompression(file, options);
    return compressed;
  }

  async function handleSubmit(
    values: any,
    ingredients: Ingredient[],
    steps: Array<{ instruction: string; stepNumber: number }>,
    tagIds: number[],
    nutrition: RecipeNutrition
  ) {
    setIsSubmitting(true);

    try {
      if (!session) {
        throw new Error("User is not authenticated");
      }

      if (!id) {
        throw new Error("Recipe ID is missing");
      }

      let imageUrl = recipe?.image_url || "";

      // If a new image was uploaded, compress and upload it
      if (values.image) {
        // Delete the old image if it exists
        if (recipe?.image_url) {
          const urlParts = recipe.image_url.split('/recipe-images/');
          const oldImagePath = urlParts[1];
          
          if (oldImagePath) {
            const { error: deleteError } = await supabase.storage
              .from('recipe-images')
              .remove([oldImagePath]);
            
            if (deleteError) {
              console.error('Error deleting old image:', deleteError);
            }
          }
        }

        // Upload the new image
        const compressedImage = await compressRecipeImage(values.image);
        const { data, error: storageError } = await supabase.storage
          .from('recipe-images')
          .upload('recipes/' + crypto.randomUUID(), compressedImage);
        
        if (storageError) {
          throw new Error('Error uploading image: ' + storageError.message);
        }

        imageUrl = supabase.storage.from('recipe-images').getPublicUrl(data.path).data.publicUrl;
      }

      const updatedRecipe: Recipe = {
        ...recipe,
        title: values.title,
        description: values.description,
        cuisine: values.cuisine,
        meal_type: values.meal_type,
        spice_level: values.spice_level,
        cook_time: values.cook_time,
        servings: values.servings,
        ingredients: ingredients,
        steps: steps,
        image_url: imageUrl,
        created_at: recipe?.created_at || new Date().toISOString(),
        creator: recipe?.creator || session.user.id,
      };

      await updateRecipe(updatedRecipe, parseInt(id));

      // Update recipe tags - delete existing and insert new ones
      const { error: deleteTagError } = await supabase
        .from('recipe_tags')
        .delete()
        .eq('recipe_id', parseInt(id));

      if (deleteTagError) {
        throw new Error('Error deleting old tags: ' + deleteTagError.message);
      }

      if (tagIds.length > 0) {
        const { error: tagError } = await supabase
          .from('recipe_tags')
          .insert(tagIds.map(tagId => ({
            recipe_id: parseInt(id),
            tag_id: tagId
          })));

        if (tagError) {
          throw new Error('Error adding recipe tags: ' + tagError.message);
        }
      }

      // Handle nutrition info
      if (nutrition.calories > 0) {
        const nutritionData = {
          ...nutrition,
          recipe_id: parseInt(id)
        };
        
        // Check if nutrition info already exists
        if (recipe?.nutrition) {
          // Update existing nutrition
          await updateNutrition(nutritionData, parseInt(id));
        } else {
          // Add new nutrition
          await addNutrition(nutritionData);
        }
      } else if (recipe?.nutrition) {
        // User cleared nutrition info - delete it
        await deleteNutrition(parseInt(id));
      }

      alert("Recipe updated successfully!");
      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <NavigationBar />
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <p>Loading recipe...</p>
        </div>
      </>
    );
  }

  if (!recipe) {
    return (
      <>
        <NavigationBar />
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <p>Recipe not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Delete button */}
        {session && (
          <div className='flex justify-end mb-4'>
            <Button 
              variant="destructive" 
              onClick={() => handleDelete(recipe, Number(id))}
              disabled={isDeleting}
            >
              {isDeleting ? 'Sletter...' : 'Slett oppskrift'}
            </Button>
          </div>
        )}
        
        <RecipeForm
          mode="edit"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          initialData={recipe}
        />
      </div>
    </>
  );
}

export default EditRecipe;