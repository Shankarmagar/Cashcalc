import "./BPCard.css"
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect} from "react";
import { selectId } from "../redux/authSlice";
import { fetchExpenses } from "../redux/expensesSlice";
function BPCard({ title }) {
  const isTitleOne = title === "Necessary Budget";
  const isTitleTwo = title === "Medium Need";
  const isTitleThree = title === "Unnecessary Budget";
  // const isEmpty =monthly_expenses.length
  const necArray =[];
  const medArray =[];
  const unArray =[];
  const { monthly_expenses } = useSelector((state) => state.expensesData);
  const Id = useSelector((state) => selectId(state));
  const stringId = Id.toString();
  const dispatch = useDispatch();
  useEffect(() =>{
    dispatch(fetchExpenses(stringId))
    // getNecessary()
    // getMedium()
    // getUnnecessary()
  }, [dispatch, stringId]);
  
  function getNecessary(){
    for(let i =0; i< monthly_expenses.length; i++)
    {
      if(monthly_expenses[i].need == "necessary")
        necArray.push(monthly_expenses[i]);
    }   
    
    }
    function getMedium(){
      for(let i =0; i< monthly_expenses.length; i++)
      {
        if(monthly_expenses[i].need == "medium")
          medArray.push(monthly_expenses[i]);
      }   
      
      }
      function getUnnecessary(){
        for(let i =0; i< monthly_expenses.length; i++)
        {
          if(monthly_expenses[i].need == "unnecessary")
            unArray.push(monthly_expenses[i]);
        }  
        }
  return(
    <>
    <div className="bigContainer">
  <div className="BPcard">
    <h2>{title}</h2>
    {
      getNecessary()
    }
    {
      getMedium()
    }
    {
      getUnnecessary()
    }
    { isTitleOne && <> 
    {necArray.map(function (nec) {
      return (
      <div className="innerBP" key={nec._id}>
        <p id="leftaligned">{nec.recipient}</p>
        <p id="leftaligned">Category: {nec.category}</p>
        <p id="rightaligned">${nec.expenseAmount}</p>
      </div>);})}</>
    }
    { isTitleTwo && <> 
    {medArray.map(function (med) {
      return (
      <div className="innerBP" key={med._id}>
        <p id="leftaligned">{med.recipient}</p>
        <p id="leftaligned">Category: {med.category}</p>
        <p id="rightaligned">${med.expenseAmount}</p>
      </div>);})}</>
    }
    { isTitleThree && <> 
    {unArray.map(function (un) {
      return (
      <div className="innerBP" key={un._id}>
        <p id="leftaligned">{un.recipient}</p>
        <p id="leftaligned">Category: {un.category}</p>
        <p id="rightaligned">${un.expenseAmount}</p>
      </div>);})}</>
    }
  </div>
  </div>
  
  </>);}
export default BPCard;