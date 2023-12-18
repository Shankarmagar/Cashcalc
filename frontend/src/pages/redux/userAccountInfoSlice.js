import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create an async thunk
export const useGetShowUserDetailsQuery = createAsyncThunk(
  'userDetails/getShowUserDetails',
  async (userId, thunkAPI) => {
    // Your async logic here, fetching user details
    const response = await axios.get(`http://localhost:3001/cashcalc/getUserData/${userId}`);
    return response.data;
  }
);

// Create a slice
const userAccountInfo = createSlice({
  name: 'userAccountInfo',
  initialState: {
    userDetails: null,
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(useGetShowUserDetailsQuery.fulfilled, (state, action) => {
      state.userDetails = action.payload;
    });
    // other extra reducers...
  },
});

export default userAccountInfo.reducer;