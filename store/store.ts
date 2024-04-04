import AsyncStorage from '@react-native-async-storage/async-storage';
import { Middleware, combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore
} from 'redux-persist';

import generatedRecipesReducer from './slices/generatedRecipesSlice';
import modalReducer from './slices/modalSlice';
import recentRecipesReducer from './slices/recentRecipesSlice';

const rootReducer = combineReducers({
  generatedRecipes: generatedRecipesReducer,
  recentRecipes: recentRecipesReducer,
  modal: modalReducer
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['generatedRecipes'] //temporary
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware: Middleware[] = [];

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(middleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
