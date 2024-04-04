import { Ingredient } from '../firebase/recipe';

export type AIRecipeRequest = {
  ingredients: string[];
  generateImage?: boolean;
  cuisine?: string;
  measurementSystem?: string;
};

export type AIRecipe = {
  name: string;
  description: string;
  ingredients: Ingredient[];
  difficulty: string;
  cookingTime: number;
  steps: string[];
  missingIngredients: AIMissingIngredient[];
  image: string;
};

export type AIMissingIngredient = Ingredient & {
  optional: boolean;
};

export type AIRecipeEdibilityCheck = {
  ingredient: string;
  edible: boolean;
  reason: string;
};

export type AIRecipeEdibilityCheckRequest = {
  ingredients: string[];
};

export type AIRecipeError = {
  message: string;
  error: string;
  statusCode: number;
};
