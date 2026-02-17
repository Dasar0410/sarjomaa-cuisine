import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, Plus } from 'lucide-react';
import { Recipe, Ingredient, Tag, RecipeNutrition } from '../../types/recipe';
import { getTags } from '@/api/tag';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { ImageCropper } from '../../components/ImageCropper';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

const recipeFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  cuisine: z.string().min(1, 'Please select a cuisine'),
  meal_type: z.string().min(1, 'Please select a meal type'),
  spice_level: z.string().min(1, 'Please select a spice level'),
  cook_time: z.number().min(1, 'Please enter the cook time'),
  servings: z.number().min(1, 'Please enter the number of servings'),
  image: z.instanceof(File, { message: 'Please select an image for the recipe' }).optional(),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

interface RecipeFormProps {
  mode: 'add' | 'edit';
  initialData?: Recipe;
  onSubmit: (
    values: RecipeFormValues,
    ingredients: Ingredient[],
    steps: Array<{ instruction: string; stepNumber: number }>,
    tagIds: number[],
    nutrition: RecipeNutrition
  ) => Promise<void>;
  isSubmitting: boolean;
}

export function RecipeForm({ mode, initialData, onSubmit, isSubmitting }: RecipeFormProps) {
  const [tagIds, setTagIds] = useState<number[]>(initialData?.tags?.map(tag => tag.id) || []);
  const [tags, setTags] = useState<Tag[]>([]);
  
  // Image cropping state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  // Nutrition state
  const [nutrition, setNutrition] = useState<RecipeNutrition>({
    calories: initialData?.nutrition?.calories || 0,
    protein: initialData?.nutrition?.protein || 0,
    carbohydrates: initialData?.nutrition?.carbohydrates || 0,
    fat: initialData?.nutrition?.fat || 0,
    fiber: initialData?.nutrition?.fiber || 0,
  });

  const fetchTags = async () => {
    const data = await getTags();
    setTags(data);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const [ingredients, setIngredients] = useState<Ingredient[]>(initialData?.ingredients || []);
  const [steps, setSteps] = useState<Array<{ instruction: string; stepNumber: number }>>
    (initialData?.steps || []);

  // Ingredient form state
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
    name: "",
    unit: "g",
    amount: 0
  });

  // Step form state
  const [currentStep, setCurrentStep] = useState<string>("");

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      cuisine: initialData?.cuisine || "",
      meal_type: initialData?.meal_type || "",
      spice_level: initialData?.spice_level || "",
      cook_time: initialData?.cook_time || 1,
      servings: initialData?.servings || 1,
      image: undefined,
    },
  });

  const addIngredient = () => {
    if (currentIngredient.name.trim() && currentIngredient.amount > 0) {
      setIngredients(prev => [...prev, currentIngredient]);
      setCurrentIngredient({ name: "", unit: "g", amount: 0 });
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (currentStep.trim()) {
      setSteps(prev => [...prev, {
        instruction: currentStep,
        stepNumber: prev.length + 1
      }]);
      setCurrentStep("");
    }
  };

  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index).map((step, idx) => ({
      ...step,
      stepNumber: idx + 1
    })));
  };

  async function handleSubmit(values: RecipeFormValues) {
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }

    if (steps.length === 0) {
      alert("Please add at least one step");
      return;
    }

    await onSubmit(values, ingredients, steps, tagIds, nutrition);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">
          {mode === 'add' ? 'Add New Recipe' : 'Edit Recipe'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter recipe title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your recipe"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cuisine Field */}
            <FormField
              control={form.control}
              name="cuisine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a cuisine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="italiensk">Italiensk</SelectItem>
                      <SelectItem value="indisk">Indisk</SelectItem>
                      <SelectItem value="annet">Annet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Meal Type Field */}
            <FormField
              control={form.control}
              name="meal_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meal Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a meal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="frokost">Frokost</SelectItem>
                      <SelectItem value="lunsj">Lunsj</SelectItem>
                      <SelectItem value="middag">Middag</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                      <SelectItem value="saus">Saus</SelectItem>
                      <SelectItem value="forrett">Forrett</SelectItem>
                      <SelectItem value="siderett">Siderett</SelectItem>
                      <SelectItem value="drikke">Drikke</SelectItem>
                      <SelectItem value="suppe">Suppe</SelectItem>
                      <SelectItem value="annet">Annet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Spice Level Field */}
            <FormField
              control={form.control}
              name="spice_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spice Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a spice level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="spicy">Spicy</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cook Time Field */}
            <FormField
              control={form.control}
              name="cook_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cook Time (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="30"
                      type='number'
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Servings Field */}
            <FormField
              control={form.control}
              name="servings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servings</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Number of servings"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Section */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Toggle tag selection
                      if (tagIds.includes(tag.id)) {
                        setTagIds(tagIds.filter(id => id !== tag.id));
                      } else {
                        setTagIds([...tagIds, tag.id]);
                      }
                    }}
                    className={tagIds.includes(tag.id) ? "bg-primary text-primary-foreground" : ""}
                  >
                    {tag.slug_text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Ingredients</label>
              <div className="flex flex-wrap gap-2">
                <Input
                  placeholder="Ingredient name"
                  value={currentIngredient.name}
                  onChange={(e) => setCurrentIngredient(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 min-w-[200px]"
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={currentIngredient.amount || ""}
                  onChange={(e) => setCurrentIngredient(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-24"
                  min="0"
                  step="0.1"
                />
                <Select
                  value={currentIngredient.unit}
                  onValueChange={(value) => setCurrentIngredient(prev => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="dl">dl</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="ts">ts</SelectItem>
                    <SelectItem value="ss">ss</SelectItem>
                    <SelectItem value="stk">stk</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addIngredient} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {ingredients.length > 0 && (
                <ul className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <span>
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
              {ingredients.length === 0 && (
                <p className="text-sm text-muted-foreground">No ingredients added yet</p>
              )}
            </div>

            {/* Steps Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Instructions</label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a cooking step"
                  value={currentStep}
                  onChange={(e) => setCurrentStep(e.target.value)}
                  className="flex-1 resize-none"
                  rows={2}
                />
                <Button type="button" onClick={addStep} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {steps.length > 0 && (
                <ol className="space-y-2">
                  {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                      <span className="font-semibold text-sm mt-1">{step.stepNumber}.</span>
                      <span className="flex-1">{step.instruction}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </li>
                  ))}
                </ol>
              )}
              {steps.length === 0 && (
                <p className="text-sm text-muted-foreground">No steps added yet</p>
              )}
            </div>

            {/* Nutrition Information Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Næringsinformasjon (Valgfritt)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Kalorier</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={nutrition.calories || ''}
                    onChange={(e) => setNutrition(prev => ({ ...prev, calories: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Protein (g)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    value={nutrition.protein || ''}
                    onChange={(e) => setNutrition(prev => ({ ...prev, protein: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Karbohydrater (g)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    value={nutrition.carbohydrates || ''}
                    onChange={(e) => setNutrition(prev => ({ ...prev, carbohydrates: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Fett (g)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    value={nutrition.fat || ''}
                    onChange={(e) => setNutrition(prev => ({ ...prev, fat: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Fiber (g)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.1"
                    value={nutrition.fiber || ''}
                    onChange={(e) => setNutrition(prev => ({ ...prev, fiber: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            {/* Image Field */}
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Recipe Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Create object URL for cropping
                          const url = URL.createObjectURL(file);
                          setImageSrc(url);
                          setShowCropper(true);
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {mode === 'edit' 
                      ? 'Upload a new image to replace the current one (will be cropped to 4:3 ratio)'
                      : 'Upload an image of your dish (will be cropped to 4:3 ratio)'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting 
                ? (mode === 'add' ? "Adding Recipe..." : "Updating Recipe...") 
                : (mode === 'add' ? "Add Recipe" : "Update Recipe")}
            </Button>
          </form>
        </Form>
      </CardContent>
      
      {/* Image Cropper Modal */}
      {showCropper && imageSrc && (
        <ImageCropper
          imageSrc={imageSrc}
          onCropComplete={(croppedImage) => {
            form.setValue('image', croppedImage);
            setShowCropper(false);
            URL.revokeObjectURL(imageSrc);
            setImageSrc(null);
          }}
          onCancel={() => {
            setShowCropper(false);
            URL.revokeObjectURL(imageSrc);
            setImageSrc(null);
            // Reset the file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
          }}
        />
      )}
    </Card>
  );
}

export default RecipeForm;