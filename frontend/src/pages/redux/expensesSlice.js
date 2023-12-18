import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchExpenses = createAsyncThunk(
  "expensesData/fetchExpenses",
  async (userId, thunkAPI) => {
    console.log(userId);
    try {
      const response = await axios.get(
        `http://localhost:3001/cashcalc/expenses/${userId}`
      );
      if (!response.data) {
        return null;
      } else {
        return response.data;
      }
    } catch (error) {
      return thunkAPI.rejectWithValue("Error fetching expenses");
    }
  }
);

export const expensesSlice = createSlice({
  name: "expensesData",
  initialState: {
    monthly_expenses: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.monthly_expenses.length === 0) {
          // Concatenate database array to monthly_expenses if monthly_income is empty
          state.monthly_expenses = state.monthly_expenses.concat(
            action.payload
          );
        } else if (state.monthly_expenses.length === action.payload.length) {
          // State remains unchanged if monthly_expenses is not empty and
          // if its length is equal to the database array (identical arrays)
        } else {
          // State is updated with new elements if monthly_expenses is not empty and if its length
          // is not equal to the database array's length (new elements were added to database)
          for (
            let i = state.monthly_expenses.length;
            i < action.payload.length;
            i++
          ) {
            state.monthly_expenses.push(action.payload[i]);
          }
        }
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default expensesSlice.reducer;
