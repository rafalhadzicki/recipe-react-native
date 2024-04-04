import { Recipe } from '@/models/firebase/recipe';

export const validateRecipeDifference = (
  updatedRecipe: Recipe,
  updatedUri: string,
  oldRecipe: Recipe
) => {
  if (updatedUri !== oldRecipe.imageUri) {
    return false;
  }

  if (
    Object.keys(updatedRecipe).some(
      key =>
        updatedRecipe[key as keyof Recipe] !== oldRecipe[key as keyof Recipe] &&
        key !== 'ingredients' &&
        key !== 'preparingSteps'
    )
  ) {
    return false;
  }
  if (
    updatedRecipe.preparingSteps?.length !== oldRecipe.preparingSteps.length ||
    updatedRecipe.preparingSteps?.some((step, index) => step !== oldRecipe.preparingSteps[index])
  ) {
    return false;
  }
  if (
    updatedRecipe.ingredients?.length !== oldRecipe.ingredients.length ||
    updatedRecipe.ingredients?.some(
      (ingredient, index) =>
        ingredient.name !== oldRecipe.ingredients[index].name ||
        ingredient.amount !== oldRecipe.ingredients[index].amount
    )
  ) {
    return false;
  }

  return true;
};
