import BPCard from "./BPCard";
import "./BudgetPlanning.css";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { selectId } from "../redux/authSlice";
import {
  useGetMonthlyExpensesQuery,
  useUpdateNeedMutation,
} from "../redux/apiSlice";
import { fetchExpenses } from "../redux/expensesSlice";
let expenseID, expenseRecipient, expenseCategory, expenseDate, expenseAmount, expenseNeed, expenses;
function BudgetPlanning() {
  const medArray =[];
  const { monthly_expenses } = useSelector((state) => state.expensesData);
  const [mutateNeed] = useUpdateNeedMutation();
  const Id = useSelector((state) => selectId(state));
  const stringId = Id.toString();
  const dispatch = useDispatch();
  useEffect(() =>{
    dispatch(fetchExpenses(stringId))
  }, [dispatch, stringId]);
  const [condition, setCondition] = useState("none");
  const firstCardTitle = "Necessary Budget";
  const secondCardTitle = "Medium Need";
  const thirdCardTitle = "Unnecessary Budget";
  const HandleClick = () => {
    document.querySelector('.hiddenItem').style.visibility = 'initial';
    document.querySelector('.hiddenItem').style.marginTop = '-30%';
    setCondition('showList');
  }
  function logKey(somevalue)
  {
    expenseID = somevalue._id;
    expenseRecipient = somevalue.recipient;
    expenseCategory = somevalue.category;
    expenseDate = somevalue.date;
    expenseAmount = somevalue.expenseAmount;
  }
  function handleNecessary(){
    expenseNeed = "necessary";
  }
  function handleMedium(){
    expenseNeed = "medium";
  }
  function handleUnnecessary(){
    expenseNeed = "unnecessary";
  }

  function getNecessary(){
    for(let i =0; i< monthly_expenses.length; i++)
    {
      // console.log(monthly_expenses[i]);
      if(monthly_expenses[i].need == "medium")
        medArray.push(monthly_expenses[i]);
    }   
    console.log(medArray);
    }
     
  

  const handleConfirm = async () => {
    const needInfo = {
      recipient: expenseRecipient,
      category: expenseCategory,
      date: expenseDate,
      expenseAmount: expenseAmount,
      need: expenseNeed,
    };
    try {
      await mutateNeed({ExpenseID: expenseID, needData: needInfo });
      // dispatch(fetchExpenses(stringId));
    } catch (error) {
      console.error("Error updating need:", error);
    }
    // setExpenses(fetchedExpenseData);
    // console.log(expenses);
  }

  return (
    <div>
      <div id="columnLayout">
      <BPCard title={firstCardTitle}>
        {
          getNecessary()
        }
      </BPCard>
      <BPCard title={secondCardTitle}></BPCard>
      <BPCard title={thirdCardTitle} ></BPCard>
      </div>
      <div id="buttondiv"><button id="bpbutton" onClick={HandleClick}>+</button>&nbsp; Add Item</div>
      <div className="hiddenItem">
      {condition === "showList" && <div className="ExpenseList">
       <div className="contents">
        LIST OF EXPENSES
        {
        monthly_expenses.map((expenseEntry, index) => (
           
            <div key={index}>
              <p>Recipient: {expenseEntry.recipient} ${expenseEntry.expenseAmount} </p>
              <p>Category: {expenseEntry.category}</p>
              <p>Need: {expenseEntry.need}</p>
              <button onClick={() => logKey(expenseEntry)}>select expense</button>
           </div>
       ))
      }
     <p>Add to category:</p>
     <button onClick={handleNecessary}>Necessary</button>
     <button onClick={handleMedium}>Medium Need</button>
     <button onClick={handleUnnecessary}>Unnecessary</button>
     <button onClick={handleConfirm}>confirm</button> 
      
       </div>

      
       
     </div>}
      </div>
      
    </div>              
  );
}

export default BudgetPlanning;