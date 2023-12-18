import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBudget = createAsyncThunk(
  "budgetData/fetchBudget",
  async (userId, thunkAPI) => {
    console.log(userId);
    try {
      const response = await axios.get(
        `http://localhost:3001/cashcalc/budget/${userId}`
      );
      if (!response.data) {
        return null;
      } else {
        return response.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching budget");
    }
  }
);

export const budgetSlice = createSlice({
  name: "budgetData",
  initialState: {
    budget: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.budget = action.payload;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default budgetSlice.reducer;
