import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';

const initialState = {
  recentRecipesIds: [] as string[]
};

const recentRecipesSlice = createSlice({
  name: 'recentRecipes',
  initialState,
  reducers: {
    addRecentRecipe: (state, action: PayloadAction<string>) => {
      if (state.recentRecipesIds.includes(action.payload)) {
        return;
      }
      state.recentRecipesIds.push(action.payload);
    }
  }
});

export const { addRecentRecipe } = recentRecipesSlice.actions;
export const selectRecentRecipesIds = (state: RootState) => state.recentRecipes.recentRecipesIds;

export default recentRecipesSlice.reducer;
