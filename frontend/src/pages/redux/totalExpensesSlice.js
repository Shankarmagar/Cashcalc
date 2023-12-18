import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTotalExpenses = createAsyncThunk(
  "totalExpensesData/fetchTotalExpenses",
  async (userId, thunkAPI) => {
    console.log(userId);
    try {
      const response = await axios.get(
        `http://localhost:3001/cashcalc/total_expenses/${userId}`
      );
      if (!response.data) {
        return null;
      } else {
        return response.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching total expenses");
    }
  }
);

export const totalExpensesSlice = createSlice({
  name: "totalExpensesData",
  initialState: {
    total_expenses: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total_expenses = action.payload;
      })
      .addCase(fetchTotalExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default totalExpensesSlice.reducer;
