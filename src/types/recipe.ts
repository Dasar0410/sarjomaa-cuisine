export interface Tag {
  id: number
  name: string
  slug_text: string
}

export interface Recipe {
    id?: number
    title: string
    description: string
    ingredients: Ingredient[]
    steps: Step[]
    cuisine: string
    meal_type: string
    spice_level: string
    cook_time: number
    servings: number
    created_at: string
    image_url: string
    creator: string
    tags?: Tag[]
  }

  export interface Step{
    stepNumber: number
    instruction: string
  }

  export interface Ingredient{
    name: string
    unit: string
    amount: number
    
  }