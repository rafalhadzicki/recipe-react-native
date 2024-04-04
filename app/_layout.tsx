import * as eva from '@eva-design/eva';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider } from '@ui-kitten/components';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AppTheme from '@/assets/theme/AppTheme';
import { Screens } from '@/enums/screens';

import '@/i18n';

import { persistor, store } from '@/store/store';
export const queryClient = new QueryClient();

const StackLayout = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={AppTheme}>
            <ApplicationProvider {...eva} theme={eva.light}>
              <Stack>
                <Stack.Screen name={Screens.Index} options={{ headerShown: false }} />
                <Stack.Screen name={Screens.Register} options={{ headerShown: false }} />
                <Stack.Screen name={Screens.Login} options={{ headerShown: false }} />
                <Stack.Screen name={Screens.TabGroup} options={{ headerShown: false }} />
                <Stack.Screen name={Screens.RecipeDetails} options={{ headerShown: false }} />
                <Stack.Screen name={Screens.Search} options={{ headerShown: false }} />
              </Stack>
            </ApplicationProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
};

export default StackLayout;
