import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ENDPOINTS } from '@/constants/endpoints';
import {
  AIRecipe,
  AIRecipeEdibilityCheck,
  AIRecipeEdibilityCheckRequest,
  AIRecipeRequest
} from '@/models/AIApi/AIRecipe';
import apiClient from '@/utils/apiClient';

export const useGenerateRecipe = () => {
  const { mutate: generateRecipe, isLoading: isRecipeGenerating } = useMutation<
    AIRecipe,
    AxiosError,
    AIRecipeRequest
  >({
    mutationFn: async (recipeRequest: AIRecipeRequest) => {
      const data = await apiClient.post<AIRecipe, AIRecipeRequest>(
        ENDPOINTS.GENERATE_RECIPE,
        recipeRequest
      );
      return data;
    }
  });
  return { generateRecipe, isRecipeGenerating };
};

export const useValidateRecipe = () => {
  const { mutate: validateRecipe, isLoading: isValidating } = useMutation<
    AIRecipeEdibilityCheck[],
    AxiosError,
    AIRecipeEdibilityCheckRequest
  >({
    mutationFn: async (ingredients: AIRecipeEdibilityCheckRequest) => {
      const data = await apiClient.post<AIRecipeEdibilityCheck[], AIRecipeEdibilityCheckRequest>(
        ENDPOINTS.VALIDATE_INGREDIENTS,
        ingredients
      );
      return data;
    }
  });
  return { validateRecipe, isValidating };
};
