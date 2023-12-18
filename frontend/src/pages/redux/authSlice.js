import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    Id: null,
  },
  reducers: {
    saveId: (state, action) => {
      state.Id = action.payload;
    },
  },
});

export const { saveId } = authSlice.actions;
export const selectId = (state) => state.auth.Id;

export default authSlice.reducer;
