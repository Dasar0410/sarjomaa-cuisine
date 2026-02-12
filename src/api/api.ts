// Contains functions for interacting with the recipes table in the database.
// logic related to fetching or filtering recipes to be added here.

import supabase from '../api/supabase'
import { Recipe, RecipeNutrition } from '../types/recipe'

export async function getRecipes(): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, recipe_tags(tags(id, name, slug_text)), recipe_nutrition(*)')

  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
  
  // Transform to flatten tags and nutrition from join tables
  const recipes = (data || []).map((recipe: any) => ({
    ...recipe,
    tags: recipe.recipe_tags?.map((rt: any) => rt.tags) || [],
    nutrition: recipe.recipe_nutrition?.[0] || null
  }))
  
  return recipes as Recipe[]
}

// Function to get the newest recipes but only information necessary for the recipe card
export async function getRecipeCard(i: number): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('title, description, image_url, id, cuisine, created_at')
    .order('created_at', { ascending: false })
    .limit(i)

  if (error) {
    console.error('Error fetching recipes:', error)
    return []
  }
  // Return an empty array if no data is returned
  return (data as Recipe[]) || []
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, recipe_nutrition(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
  
  // Transform nutrition data
  const recipe = {
    ...data,
    nutrition: data.recipe_nutrition?.[0] || null
  }
  
  return recipe as Recipe
}

export async function addRecipe(recipe: Recipe, imageFile: File, tagIds: number[]) {
  const { data, error: storageError  } = await supabase.storage.from('recipe-images').upload('recipes/' + crypto.randomUUID(), imageFile)
  if (storageError) {
    throw new Error('Error uploading image: ' + storageError.message)
  }

  const imageUrl = supabase.storage.from('recipe-images').getPublicUrl(data.path).data.publicUrl
  recipe.image_url = imageUrl
  console.log('Image uploaded successfully:', imageUrl)

  const { data: recipeData, error } = await supabase
    .from('recipes')
    .insert([recipe])
    .select()

  if (error) {
    throw new Error('Error adding recipe: ' + error.message)
  }
  if (tagIds.length > 0 && recipeData) {
    const { error: tagError } = await supabase
    .from('recipe_tags')
    .insert(tagIds.map(tagId => ({
      recipe_id: recipeData[0].id,
      tag_id: tagId
    })))

      if (tagError) {
        throw new Error('Error adding recipe tags: ' + tagError.message)

    }
  }
}
  

export async function updateRecipe(recipe: Recipe, id: number) {
  const {error } = await supabase
    .from('recipes')
    .update(recipe) // Update the recipe with the new data 
    .eq('id', id) 
    .select() // Return the updated record

  if (error) {
    console.error('Error updating recipe:', error)
    return null
  }
}

export async function deleteRecipe(id: number) {
  const {error} = await supabase
  .from('recipes')
  .delete()
  .eq('id', id )

  if (error){
    console.error('Error deleting recipe: ', error)
  }
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .ilike('title', `%${query}%`)

  if (error) {
    console.error('Error searching recipes:', error)
    return []
  }
  // Return an empty array if no data is returned
  return (data as Recipe[]) || []
}

// Nutrition API functions
export async function addNutrition(nutrition: RecipeNutrition) {
  const { data, error } = await supabase
    .from('recipe_nutrition')
    .insert([nutrition])
    .select()

  if (error) {
    throw new Error('Error adding nutrition info: ' + error.message)
  }
  
  return data[0]
}

export async function updateNutrition(nutrition: RecipeNutrition, recipeId: number) {
  const { error } = await supabase
    .from('recipe_nutrition')
    .update(nutrition)
    .eq('recipe_id', recipeId)

  if (error) {
    throw new Error('Error updating nutrition info: ' + error.message)
  }
}

export async function deleteNutrition(recipeId: number) {
  const { error } = await supabase
    .from('recipe_nutrition')
    .delete()
    .eq('recipe_id', recipeId)

  if (error) {
    console.error('Error deleting nutrition info:', error)
  }
}