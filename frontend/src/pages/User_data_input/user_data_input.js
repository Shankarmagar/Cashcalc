import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useUpdateMonthlyIncomeMutation,
  useUpdateMonthlyExpensesMutation,
  useUpdateBudgetMutation,
  useUpdateTotalExpensesMutation,
  useUpdateTotalIncomeMutation,
} from "../redux/apiSlice";
import { fetchBudget } from "../redux/budgetSlice";
import { fetchIncome } from "../redux/incomeSlice";
import { fetchExpenses } from "../redux/expensesSlice";
import { fetchTotalExpenses } from "../redux/totalExpensesSlice";
import { fetchTotalIncome } from "../redux/totalIncomeSlice";
import { selectId } from "../redux/authSlice";
import "./user_data_input.css";

export default function User_Data_Input() {
  const { budget } = useSelector((state) => state.budgetData);
  const { monthly_income } = useSelector((state) => state.incomeData);
  const { monthly_expenses } = useSelector((state) => state.expensesData);
  const { total_expenses } = useSelector((state) => state.totalExpensesData);
  const { total_income } = useSelector((state) => state.totalIncomeData);

  const [mutateIncome] = useUpdateMonthlyIncomeMutation();
  const [mutateExpenses] = useUpdateMonthlyExpensesMutation();
  const [mutateBudget] = useUpdateBudgetMutation();
  const [mutateTotalExpenses] = useUpdateTotalExpensesMutation();
  const [mutateTotalIncome] = useUpdateTotalIncomeMutation();

  const Id = useSelector((state) => selectId(state));
  const stringId = Id.toString();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBudget(stringId));
    dispatch(fetchIncome(stringId));
    dispatch(fetchExpenses(stringId));
  }, [dispatch, stringId]);

  const [totalExpensesData, setTotalExpensesData] = useState({
    total_expenses: 0,
  });

  const [totalIncomeData, setTotalIncomeData] = useState({
    total_income: 0,
  });

  const calculateTotalIncome = async () => {
    try {
      let income_sum = 0;
      for (let i = 0; i < monthly_income.length; i++) {
        income_sum += monthly_income[i].incomeAmount;
      }
      console.log(`income_sum: ${income_sum}`);
      setTotalIncomeData((prevTotalIncomeData) => ({
        ...prevTotalIncomeData,
        total_income: income_sum,
      }));
      console.log(`totalIncomeData: ${totalIncomeData.total_income}`);
      await mutateTotalIncome({
        Id: stringId,
        totalIncomeData: { total_income: income_sum },
      });
      dispatch(fetchTotalIncome(stringId));
    } catch (error) {
      console.error("Error updating monthly income:", error);
    }
  };

  const calculateTotalExpenses = async () => {
    try {
      let expenses_sum = 0;
      for (let i = 0; i < monthly_expenses.length; i++) {
        expenses_sum += monthly_expenses[i].expenseAmount;
      }
      console.log(`expenses_sum: ${expenses_sum}`);
      setTotalExpensesData((prevTotalExpensesData) => ({
        ...prevTotalExpensesData,
        total_expenses: expenses_sum,
      }));
      console.log(`totalExpensesData: ${totalExpensesData.total_expenses}`);
      await mutateTotalExpenses({
        Id: stringId,
        totalExpensesData: { total_expenses: expenses_sum },
      });
      dispatch(fetchTotalExpenses(stringId));
    } catch (error) {
      console.error("Error updating monthly expenses:", error);
    }
  };

  useEffect(() => {
    if (monthly_expenses.length > 0) {
      calculateTotalExpenses();
    }
  }, [monthly_expenses]);

  useEffect(() => {
    if (monthly_income.length > 0) {
      calculateTotalIncome();
    }
  }, [monthly_income]);

  // Set empty budget value
  const [budgetData, setBudgetData] = useState({
    budget: "",
  });

  // Set an empty income object
  const [incomeData, setIncomeData] = useState({
    source: "",
    category: "",
    date: "",
    incomeAmount: "",
  });

  // Set an empty expense object
  const [expensesData, setExpensesData] = useState({
    recipient: "",
    category: "",
    date: "",
    expenseAmount: "",
  });

  const handleBudgetInputChange = (event, field) => {
    // Set budgetData
    setBudgetData({
      ...budgetData,
      [field]: event.target.value,
    });
  };

  const handleIncomeInputChange = (event, field) => {
    // Set key-value pairs for each field in incomeData
    setIncomeData({
      ...incomeData,
      [field]: event.target.value,
    });
  };

  const handleExpenseInputChange = (event, field) => {
    // Set key-value pairs for each field in expensesData
    setExpensesData({
      ...expensesData,
      [field]: event.target.value,
    });
  };

  const handleSubmitBudget = async () => {
    try {
      // Update the database
      await mutateBudget({ Id: stringId, budgetData: budgetData });
      // Update the global state by fetching from the database
      dispatch(fetchBudget(stringId));
    } catch (error) {
      console.error("Error updating budget:", error);
    }
    // Reset budgetData for subsequent entries
    setBudgetData({
      budget: "",
    });
  };

  const handleSubmitIncome = async () => {
    // Update the database
    try {
      await mutateIncome({ Id: stringId, incomeData: incomeData });
      // Update the global state by fetching from the database
      dispatch(fetchIncome(stringId));
      calculateTotalIncome();
    } catch (error) {
      console.error("Error updating monthly income:", error);
    }
    // Reset incomeData for subsequent entries
    setIncomeData({
      source: "",
      category: "",
      date: "",
      incomeAmount: "",
    });
  };

  const handleSubmitExpense = async () => {
    // Update the database
    try {
      await mutateExpenses({ Id: stringId, expensesData: expensesData });
      // Update the global state by fetching from the database
      dispatch(fetchExpenses(stringId));
      calculateTotalExpenses();
    } catch (error) {
      console.error("Error updating monthly expenses:", error);
    }
    // Reset expenseData for subsequent entries
    setExpensesData({
      recipient: "",
      category: "",
      date: "",
      expenseAmount: "",
    });
  };

  return (
    <div className="GetStarted">
      <h2 className="get-started-title">Get Started</h2>
      <h3 className="get-started-h3-budget">Enter Budget</h3>
      <div className="input-box">
        <input
          className="get-started-input"
          type="number"
          value={budgetData.budget}
          onChange={(e) => handleBudgetInputChange(e, "budget")}
          placeholder="Enter budget"
        />
        <br />
        <button
          className="get-started-submit-budget"
          onClick={handleSubmitBudget}
        >
          Submit
        </button>
      </div>
      <div className="current-budget-box">
        <p className="current-budget-text">Current Budget: $ {budget}</p>
      </div>
      <h3 className="get-started-h3-income">Enter Monthly Income</h3>
      <div className="input-box">
        <label>
          Source:
          <input
            className="get-started-input"
            type="text"
            value={incomeData.source}
            onChange={(e) => handleIncomeInputChange(e, "source")}
            placeholder="Enter income source"
          />
        </label>
        <br />
        <label>
          Category:
          <input
            className="get-started-input"
            type="text"
            value={incomeData.category}
            onChange={(e) => handleIncomeInputChange(e, "category")}
            placeholder="Enter income category"
          />
        </label>
        <br />
        <label>
          Date:
          <input
            className="get-started-input"
            type="date"
            value={incomeData.date}
            onChange={(e) => handleIncomeInputChange(e, "date")}
            placeholder="Enter date in format: YYYY-MM-DD"
          />
        </label>
        <br />
        <label>
          Amount:
          <input
            className="get-started-input"
            type="number"
            value={incomeData.incomeAmount}
            onChange={(e) => handleIncomeInputChange(e, "incomeAmount")}
            placeholder="Enter amount"
          />
        </label>
        <br />
        <button className="get-started-submit" onClick={handleSubmitIncome}>
          Submit
        </button>
      </div>
      <p className="income-array-title">Monthly Income Entries:</p>
      {total_income === undefined ? (
        <p>Loading...</p>
      ) : (
        <p>Total Income: $ {total_income}</p>
      )}
      {monthly_income.map((incomeEntry, index) => (
        <div className="get-started-entry" key={index}>
          <p>Source: {incomeEntry.source}</p>
          <p>Category: {incomeEntry.category}</p>
          <p>Date: {incomeEntry.date}</p>
          <p>Amount: $ {incomeEntry.incomeAmount}</p>
        </div>
      ))}
      <h3 className="get-started-h3-expenses">Enter Monthly Expenses</h3>
      <div className="input-box">
        <label>
          Recipient:
          <input
            className="get-started-input"
            type="text"
            value={expensesData.recipient}
            onChange={(e) => handleExpenseInputChange(e, "recipient")}
            placeholder="Enter expense recipient"
          />
        </label>
        <br />
        <label>
          Category:
          <input
            className="get-started-input"
            type="text"
            value={expensesData.category}
            onChange={(e) => handleExpenseInputChange(e, "category")}
            placeholder="Enter expense category"
          />
        </label>
        <br />
        <label>
          Date:
          <input
            className="get-started-input"
            type="date"
            value={expensesData.date}
            onChange={(e) => handleExpenseInputChange(e, "date")}
            placeholder="Enter date in format: YYYY-MM-DD"
          />
        </label>
        <br />
        <label>
          Amount:
          <input
            className="get-started-input"
            type="number"
            value={expensesData.expenseAmount}
            onChange={(e) => handleExpenseInputChange(e, "expenseAmount")}
            placeholder="Enter amount"
          />
        </label>
        <br />
        <button className="get-started-submit" onClick={handleSubmitExpense}>
          Submit
        </button>
      </div>
      <p className="expenses-array-title">Monthly Expenses Entries:</p>
      {total_expenses === undefined ? (
        <p>Loading...</p>
      ) : (
        <p>Total Expenses: $ {total_expenses}</p>
      )}
      {monthly_expenses.map((expenseEntry, index) => (
        <div className="get-started-entry" key={index}>
          <p>Recipient: {expenseEntry.recipient}</p>
          <p>Category: {expenseEntry.category}</p>
          <p>Date: {expenseEntry.date}</p>
          <p>Amount: $ {expenseEntry.expenseAmount}</p>
        </div>
      ))}
    </div>
  );
}
