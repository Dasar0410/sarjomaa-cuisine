export interface Review {
  id: number
  recipe_id: number
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
  profiles: { display_name: string | null }  // from the join
}