import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Trash2, Plus } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import { Recipe, Ingredient } from '../types/recipe';
import { addRecipe } from '../api/api';
import imageCompression from "browser-image-compression";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const recipeFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  cuisine: z.string().min(1, 'Please select a cuisine'),
  meal_type: z.string().min(1, 'Please select a meal type'),
  spice_level: z.string().min(1, 'Please select a spice level'),
  cook_time: z.string().min(1, 'Please enter the cook time'),
  servings: z.number().min(1, 'Please enter the number of servings'),
  image: z.instanceof(File, { message: 'Please select an image for the recipe' }),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

function NewRecipe() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Array<{ instruction: string; stepNumber: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      title: "",
      description: "",
      cuisine: "",
      meal_type: "",
      spice_level: "",
      cook_time: "",
      servings: 1,
      image: undefined,
    },
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

  async function onSubmit(values: RecipeFormValues) {
    if (ingredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }

    if (steps.length === 0) {
      alert("Please add at least one step");
      return;
    }

    setIsSubmitting(true);

    try {
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
        creator: 1,
        image_url: "",
      };

      await addRecipe(recipe, compressedImage);

      // Reset form
      form.reset();
      setIngredients([]);
      setSteps([]);
      setCurrentIngredient({ name: "", unit: "g", amount: 0 });
      setCurrentStep("");

      alert("Recipe added successfully!");
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Add New Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          <SelectItem value="hot">Hot</SelectItem>
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
                      <FormLabel>Cook Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 30 minutes" {...field} />
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="tsp">tsp</SelectItem>
                        <SelectItem value="tbsp">tbsp</SelectItem>
                        <SelectItem value="cup">cup</SelectItem>
                        <SelectItem value="pc">pc</SelectItem>
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
                              onChange(file);
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload an image of your dish (max 1MB, will be compressed)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default NewRecipe;