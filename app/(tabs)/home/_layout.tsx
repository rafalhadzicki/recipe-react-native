import { Stack } from 'expo-router';

import { Screens } from '@/enums/screens';

const RecipesLayout = () => {
  return (
    <Stack>
      <Stack.Screen name={Screens.Index} options={{ headerShown: false }} />
    </Stack>
  );
};

export default RecipesLayout;
