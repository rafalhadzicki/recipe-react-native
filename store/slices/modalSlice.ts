import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../store';

const initialState = {
  isModalOpen: false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    }
  }
});

export const { setModalOpen } = modalSlice.actions;
export const selectModalState = (state: RootState) => state.modal.isModalOpen;

export default modalSlice.reducer;
