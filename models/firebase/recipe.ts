import { RecipeFormFields, SortingDirections } from '@/enums/dbFields';

export type Recipe = {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  authorId?: string;
  categoryId: string;
  name: string;
  preparingTime: number;
  rating?: number;
  ratingCount?: number;
  servings: number;
  ingredients: Ingredient[];
  preparingSteps: string[];
  imageUri?: string;
  authorName?: string;
};

export type Ingredient = {
  id?: string;
  name: string;
  amount: string;
  unit?: string;
};

export type RecipeCategory = {
  id?: string;
  createdAt?: number;
  updatedAt?: number;
  name: string;
};

export type RecipeImage = {
  recipeId: string;
  uri: string;
};

export type RecipeSortingParams = {
  sortBy: RecipeFormFields;
  rating?: number;
  categoryId?: string;
  direction: SortingDirections;
  name?: string;
  lastVisibleDocId?: string;
};

export type UserRating = {
  id?: string;
  recipeId: string;
  userId: string;
  rating: number;
};
