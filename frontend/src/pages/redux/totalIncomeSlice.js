import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTotalIncome = createAsyncThunk(
  "totalIncomeData/fetchTotalIncome",
  async (userId, thunkAPI) => {
    console.log(userId);
    try {
      const response = await axios.get(
        `http://localhost:3001/cashcalc/total_income/${userId}`
      );
      if (!response.data) {
        return null;
      } else {
        return response.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching total income");
    }
  }
);

export const totalIncomeSlice = createSlice({
  name: "totalIncomeData",
  initialState: {
    total_income: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalIncome.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalIncome.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.total_income = action.payload;
      })
      .addCase(fetchTotalIncome.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default totalIncomeSlice.reducer;
