import { useState, useEffect, React } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  useGetMonthlyIncomeQuery,
  useGetMonthlyExpensesQuery,
} from "../redux/apiSlice";
import { fetchExpenses } from "../redux/expensesSlice";
import { fetchTotalExpenses } from "../redux/totalExpensesSlice";
import { fetchTotalIncome } from "../redux/totalIncomeSlice";
import { selectId } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "./Dashboard.css";

function Dashboard() {
  //TODO: figure out display of savings and expenses right tab
  const [Spent, setSpent] = useState("100");
  const { monthly_expenses } = useSelector((state) => state.expensesData);
  const { total_expenses } = useSelector((state) => state.totalExpensesData);
  const { total_income } = useSelector((state) => state.totalIncomeData);

  const Id = useSelector((state) => selectId(state));
  const stringId = Id.toString();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExpenses(stringId));
    dispatch(fetchTotalIncome(stringId));
    dispatch(fetchTotalExpenses(stringId));
  }, [dispatch, stringId]);

  const {
    data: fetchedIncomeData,
    error: incomeError,
    isLoading: isIncomeLoading,
  } = useGetMonthlyIncomeQuery(stringId);
  const {
    data: fetchedExpensesData,
    error: expensesError,
    isLoading: isExpensesLoading,
  } = useGetMonthlyExpensesQuery(stringId);

  let profit = total_income - total_expenses;
  //copies monthly_income to incArray
  let incArray = fetchedIncomeData;
  //copies monthly_expenses to expArray
  let expArray = fetchedExpensesData;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  //map function to format Date field to remove clock
  let modifiedIncomeArr = incArray?.map(function (e) {
    return {
      ...e,
      date: new Date(e.date).toISOString().split("T")[0],
    };
  });
  let modifiedExpenseArr = expArray?.map(function (e) {
    return {
      ...e,
      date: new Date(e.date).toISOString().split("T")[0],
    };
  });
  //sorts Date in array from earliest date in x month to most current date in x month
  modifiedIncomeArr?.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  modifiedExpenseArr?.sort(function (a, b) {
    return new Date(a.date) - new Date(b.date);
  });
  //test to view format in console, will remove later
  console.log(modifiedIncomeArr);

  //to replace graph represenation, remove modifiedIncomeArr to array of choosing
  const renderIncomeGraph = (
    <LineChart width={350} height={300} data={modifiedIncomeArr}>
      <Line
        type="monotone"
        dataKey="incomeAmount"
        stroke="#00FF00"
        strokeWidth={2}
      />
      <XAxis dataKey="date" offset={0} />
      <Tooltip />
    </LineChart>
  );
  const renderExpenseGraph = (
    <LineChart width={350} height={300} data={modifiedExpenseArr}>
      <Line
        type="monotone"
        dataKey="expenseAmount"
        stroke="#FF0000"
        strokeWidth={2}
      />
      <XAxis dataKey="date" />
      <Tooltip />
    </LineChart>
  );

  const renderSpent = (
    <PieChart width={400} height={400}>
      <Pie
        dataKey="expenseAmount"
        data={expArray}
        cx={200} //positioning on x-axis
        cy={200} //positioning on y-axis
        innerRadius={60} //affects inner circle in pie
        outerRadius={90} //affects pie itself
        paddingAngle={0} //distance between segmented bars
        fill="FF0000" //determines color in pie
      >
        {expArray?.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );

  return (
    <>
      <h1 className="centerText">Dashboard</h1>

      <div className="displayIncome">
        Income
        <renderGraph>{renderIncomeGraph}</renderGraph>
      </div>
      <div className="displayExpense">
        Expenses
        <renderExpenseGraph>{renderExpenseGraph}</renderExpenseGraph>
      </div>

      <div className="totalIncome">
        <section className="colorGreen">
          Income
          <br />{" "}
        </section>
        $ {total_income}
      </div>
      <div className="totalExpense">
        <section className="colorRed">
          Expense
          <br />{" "}
        </section>
        $ {total_expenses}
      </div>
      <div className="profit">
        <section className="colorGrey">
          Profit
          <br />{" "}
        </section>
        $ {profit}
      </div>
      <div className="spent">
        Spent <br />
        {Spent}
        <renderSpent>{renderSpent}</renderSpent>
      </div>

      <div className="expensesList">
        <section>---------------------------------------</section>
        <section className="bold">Expenses</section>
        {monthly_expenses.map((expenseEntry, index) => (
          <div key={index}>
            <p>
              {expenseEntry.recipient}: $ {expenseEntry.expenseAmount}
            </p>
          </div>
        ))}
        <section className="bold">
          ---------------------------------------
        </section>
      </div>
    </>
  );
}

export default Dashboard;
