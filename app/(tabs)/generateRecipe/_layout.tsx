import { Stack } from 'expo-router';

import { Screens } from '@/enums/screens';

const RecipesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name={Screens.Index} />
      <Stack.Screen name={Screens.GeneratedRecipePreview} />
    </Stack>
  );
};

export default RecipesLayout;
