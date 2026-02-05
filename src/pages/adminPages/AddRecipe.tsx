import { useState } from 'react';
import NavigationBar from '../../components/NavigationBar';
import { Recipe, Ingredient } from '../../types/recipe';
import { addRecipe } from '../../api/api';
import imageCompression from "browser-image-compression";
import { UserAuth } from '@/context/AuthContext';
import RecipeForm from './RecipeForm';

function NewRecipe() {
  const { session } = UserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const compressedImage = await compressRecipeImage(values.image);
      const recipe: Recipe = {
        title: values.title,
        description: values.description,
        cuisine: values.cuisine,
        meal_type: values.meal_type,
        spice_level: values.spice_level,
        cook_time: values.cook_time,
        servings: values.servings,
        ingredients: ingredients,
        steps: steps,
        created_at: new Date().toISOString(),
        creator: session.user.id,
        image_url: "",
      };

      await addRecipe(recipe, compressedImage, tagIds);

      alert("Recipe added successfully!");
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="">
      <NavigationBar />
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <RecipeForm
          mode="add"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

export default NewRecipe;