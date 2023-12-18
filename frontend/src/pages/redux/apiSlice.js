import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { useSelector } from "react-redux";
import { selectId } from "./authSlice";

export const apiSlice = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:3001/cashcalc/` }),
  endpoints: (builder) => ({
    getMonthlyIncome: builder.query({
      query: (Id) => ({
        url: `income/${Id}`,
        method: "GET",
      }),
    }),
    getMonthlyExpenses: builder.query({
      query: (Id) => ({
        url: `expenses/${Id}`,
        method: "GET",
      }),
    }),
    getBudget: builder.query({
      query: (Id) => ({
        url: `budget/${Id}`,
        method: "GET",
      }),
    }),
    getTotalIncome: builder.query({
      query: (Id) => ({
        url: `total_income/${Id}`,
        method: "GET",
      }),
    }),
    getTotalExpenses: builder.query({
      query: (Id) => ({
        url: `total_expenses/${Id}`,
        method: "GET",
      }),
    }),
    updateMonthlyIncome: builder.mutation({
      query: ({ Id, incomeData }) => {
        return {
          url: `income/${Id}`,
          method: "PUT",
          body: incomeData,
        };
      },
    }),
    updateMonthlyExpenses: builder.mutation({
      query: ({ Id, expensesData }) => {
        return {
          url: `expenses/${Id}`,
          method: "PUT",
          body: expensesData,
        };
      },
    }),
    updateBudget: builder.mutation({
      query: ({ Id, budgetData }) => {
        return {
          url: `budget/${Id}`,
          method: "PUT",
          body: budgetData,
        };
      },
    }),
    updateTotalIncome: builder.mutation({
      query: ({ Id, totalIncomeData }) => {
        return {
          url: `total_income/${Id}`,
          method: "PUT",
          body: totalIncomeData,
        };
      },
    }),
    updateTotalExpenses: builder.mutation({
      query: ({ Id, totalExpensesData }) => {
        return {
          url: `total_expenses/${Id}`,
          method: "PUT",
          body: totalExpensesData,
        };
      },
    }),
    // update need of specific expense entry
    updateNeed: builder.mutation({
      query: ({ExpenseID, needData }) => {
        return {
        url: `expenses/need/${ExpenseID}`,
        method: "PUT",
        body: needData,
      };
    },
  }),
   UpdateUsername: builder.mutation({
      query: ( {Id, newName}) => {
        console.log(Id);
        console.log(newName);
        return {
          url: `edit/update-profile-name/${Id}`, 
          method: 'PUT',
          body: newName, 
        };
      },
    }),

    UpdateEmailAndPassword: builder.mutation({
      query: ( {Id, data}) => {
        console.log(Id);
        console.log(data);
        return {
          url: `edit/update-passwordAndEmail/${Id}`, 
          method: 'PUT',
          body: data, 
        };
      },
    }),

     UpdateProfileImage: builder.mutation({
    query: ({ id, file }) => {
    const formData = new FormData();
    formData.append('image', file);

    console.log(formData);

    return {
      url: `edit/uploadImage/${id}`,
      method: 'POST',
      body: formData,
      headers: {
        // Note: Do not set Content-Type here, as it will be automatically set by FormData.
        
      },
    };
  },
}),
showUserDetails: builder.mutation({
  query: ( {Id}) => {
        console.log(Id);
        return {
          url: `cashcalc/getUserData/${Id}`, 
          method: 'GET',
        };
      },

}),

  }),
});

export const {
  useGetMonthlyIncomeQuery,
  useGetMonthlyExpensesQuery,
  useGetBudgetQuery,
  useGetTotalIncomeQuery,
  useGetTotalExpensesQuery,
  useUpdateMonthlyIncomeMutation,
  useUpdateMonthlyExpensesMutation,
  useUpdateBudgetMutation,
  useUpdateTotalIncomeMutation,
  useUpdateTotalExpensesMutation,
  useUpdateNeedMutation,
    useUpdateUsernameMutation,
  useUpdateEmailAndPasswordMutation,
  useUpdateProfileImageMutation,
  useGetShowUserDetailsQuery,
} = apiSlice;
