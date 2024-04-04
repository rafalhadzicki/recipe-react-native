import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';

import { AIRecipe } from '@/models/AIApi/AIRecipe';

const initialState = {
  generatedRecipes: [] as AIRecipe[]
};

const generatedRecipeSlice = createSlice({
  name: 'generatedRecipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<AIRecipe>) => {
      state.generatedRecipes.push(action.payload);
    }
  }
});

export const { addRecipe } = generatedRecipeSlice.actions;
export const selectLatestGeneratedRecipe = (state: RootState) =>
  state.generatedRecipes.generatedRecipes[state.generatedRecipes.generatedRecipes.length - 1];

export default generatedRecipeSlice.reducer;
