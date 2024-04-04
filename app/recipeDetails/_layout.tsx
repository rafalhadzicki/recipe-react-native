import { Stack } from 'expo-router';

import { Screens } from '@/enums/screens';

const RecipesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name={Screens.RecipeId} options={{ headerShown: false }} />
      <Stack.Screen name={Screens.EditRecipe} options={{ headerShown: false }} />
      <Stack.Screen name={Screens.RecipeAuthor} options={{ headerShown: false }} />
    </Stack>
  );
};

export default RecipesLayout;
