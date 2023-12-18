// profileImageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProfileImage = createAsyncThunk(
  'profileImage/fetchProfileImage',
  async (userId, thunkAPI) => {
    console.log(userId);
    try {
      const response = await axios.get(`http://localhost:3001/cashcalc/edit/getProfileImage/${userId}`, {
        responseType: 'blob', // Set the response type to 'blob' to handle binary data
      });
       if(!response.data)
       {
        return [];
       }
       else{
      const blob = response.data;
      const url = URL.createObjectURL(blob);
      return url;
       }
    } catch (error) {
      return thunkAPI.rejectWithValue('Error fetching image');
    }
  }
);

const profileImageSlice = createSlice({
  name: 'profileImage',
  initialState: { imageSrc: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileImage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfileImage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.imageSrc = action.payload;
      })
      .addCase(fetchProfileImage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default profileImageSlice.reducer;