import supabase from '../api/supabase'
import { Review } from '../types/review'

export async function getReviewsByRecipeId(recipeId: number): Promise<Review[]> {
    const { data, error } = await supabase
      .from('recipe_reviews')
      .select('*, profiles(display_name)')
      .eq('recipe_id', recipeId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }
    // Return an empty array if no data is returned
    return (data as Review[]) || []
  }

export async function addReview(recipeId: number, userId: string, rating: number, comment: string | null): Promise<void> {
    const { error } = await supabase
      .from('recipe_reviews')
      .insert([{ recipe_id: recipeId, user_id: userId, rating, comment }])

    if (error) {
      throw new Error('Error adding review: ' + error.message)
    }
  }


export async function updateReview(reviewId: number, rating: number, comment: string | null): Promise<void> {
    const { error } = await supabase
    .from('recipe_reviews')
    .update({rating, comment, updated_at: new Date().toISOString() })
    .eq('id', reviewId)

    if (error) {
      throw new Error('Error updating review: ' + error.message)
    }
}

export async function deleteReview(reviewId: number): Promise<void> {
    const { error } = await supabase
    .from('recipe_reviews')
    .delete()
    .eq('id', reviewId)

    if (error) {
      throw new Error('Error deleting review: ' + error.message)
    }
}
