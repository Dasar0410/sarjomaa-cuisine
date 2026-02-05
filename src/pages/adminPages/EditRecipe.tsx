import NavigationBar from "@/components/NavigationBar"
import { Recipe, Ingredient } from '@/types/recipe';
import { updateRecipe as updateRecipe, getRecipeById } from '@/api/api';
import supabase from '@/api/supabase';
import imageCompression from "browser-image-compression";
import { UserAuth } from '@/context/AuthContext';
import RecipeForm from './RecipeForm';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

function EditRecipe() {
  const { session } = UserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRecipe() {
      if (id) {
        const fetchedRecipe = await getRecipeById(parseInt(id));
        if (fetchedRecipe) {
          setRecipe(fetchedRecipe);
        }
      }
    }
    fetchRecipe();
  }, [id]);

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
    tagIds: number[]
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

      alert("Recipe updated successfully!");
      navigate(`/recipes/${id}`);
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!recipe) {
    return (
      <>
        <NavigationBar />
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <p>Loading recipe...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="container max-w-4xl mx-auto py-8 px-4">
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