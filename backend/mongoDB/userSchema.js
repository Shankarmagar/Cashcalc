const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
   password_length: {
    type: Number,
    required: false,
  },
   profileImage: {
    data: Buffer, 
    contentType: String, 
  },
  budget: {
    type: Number,
    required: false,
  },
  total_income: {
    type: Number,
    required: false,
  },
  total_expenses: {
    type: Number,
    required: false,
  },
  savings: {
    type: Number,
    required: false,
  },
  target_savings: {
    type: Number,
    required: false,
  },
  monthly_income: [
    {
      income_id: {
        type: String,
        required: false,
      },
      source: {
        type: String,
        required: false,
      },
      category: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        required: false,
      },
      incomeAmount: {
        type: Number,
        required: false,
      },
    },
  ],
  monthly_expenses: [
    {
      expense_id: {
        type: String,
        required: false,
      },
      recipient: {
        type: String,
        required: false,
      },
      category: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        required: false,
      },
      expenseAmount: {
        type: Number,
        required: false,
      },
      need:{
        type: String,
        required: false,  
      },
    },
  ],
});

const userData = mongoose.model("userData", userSchema);
module.exports = userData;
