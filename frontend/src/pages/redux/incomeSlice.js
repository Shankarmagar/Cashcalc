import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchIncome = createAsyncThunk(
  "incomeData/fetchIncome",
  async (userId, thunkAPI) => {
    console.log(userId);
    try {
      const response = await axios.get(
        `http://localhost:3001/cashcalc/income/${userId}`
      );
      if (!response.data) {
        return null;
      } else {
        return response.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching income");
    }
  }
);

export const incomeSlice = createSlice({
  name: "incomeData",
  initialState: {
    monthly_income: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncome.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchIncome.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.monthly_income.length === 0) {
          // Concatenate database array to monthly_income if monthly_income is empty
          state.monthly_income = state.monthly_income.concat(action.payload);
        } else if (state.monthly_income.length === action.payload.length) {
          // State remains unchanged if monthly_income is not empty and
          // if its length is equal to the database array (identical arrays)
        } else {
          // State is updated with new elements if monthly_income is not empty and if its length
          // is not equal to the database array's length (new elements were added to database)
          for (
            let i = state.monthly_income.length;
            i < action.payload.length;
            i++
          ) {
            state.monthly_income.push(action.payload[i]);
          }
        }
      })
      .addCase(fetchIncome.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default incomeSlice.reducer;
