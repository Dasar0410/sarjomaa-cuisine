import supabase from '../api/supabase'
import { Tag } from '../types/recipe'

export async function getTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }
  // Return an empty array if no data is returned
  return (data as Tag[]) || []
}

export async function addTag(tag: Tag) {
  const { error } = await supabase
    .from('tags')
    .insert([tag])

  if (error) {
    throw new Error('Error adding tag: ' + error.message)
  }
}