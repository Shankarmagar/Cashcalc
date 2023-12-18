const express = require("express");
const userData = require("./userSchema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};
const validateFields = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    // If any of the required fields is missing, throw an error
    return res.status(400).json({ error: "Please add all fields" });
  }

  // If all required fields are present, proceed to the next middleware or route
  next();
};

// localhost:3001/cashcalc
router.get("/", verifyToken, async (req, res) => {
  try {
    const e = await userData.find({});
    res.json(e);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// localhost:3001/cashcalc/:id
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const e = await userData.findById(req.params.id);
    if (!userData) {
      return res.status(404).json({ message: "data not found" });
    }
    res.json(e);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// localhost:3001/cashcalc/income/:id
router.get("/income/:id", async (req, res) => {
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "data not found" });
    }
    const fetchedIncome = user.monthly_income;
    console.log("Monthly Income:", fetchedIncome);
    res.json(fetchedIncome);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// localhost:3001/cashcalc/expenses/:id
router.get("/expenses/:id", async (req, res) => {
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "data not found" });
    }
    const fetchedExpenses = user.monthly_expenses;
    console.log("Monthly Expenses:", fetchedExpenses);
    res.json(fetchedExpenses);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// localhost:3001/cashcalc/budget/:id
router.get("/budget/:id", async (req, res) => {
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "data not found" });
    }
    const fetchedBudget = user.budget;
    console.log("Budget", fetchedBudget);
    res.json(fetchedBudget);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// localhost:3001/cashcalc/total_income/:id
router.get("/total_income/:id", async (req, res) => {
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "data not found" });
    }
    const fetchedTotalIncome = user.total_income;
    console.log("Total Income", fetchedTotalIncome);
    res.json(fetchedTotalIncome);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// localhost:3001/cashcalc/total_expenses/:id
router.get("/total_expenses/:id", async (req, res) => {
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "data not found" });
    }
    const fetchedTotalExpenses = user.total_expenses;
    console.log("Total Expenses", fetchedTotalExpenses);
    res.json(fetchedTotalExpenses);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error retrieving data" });
  }
});

// Registration route
router.post("/register", validateFields, async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Generate a salt with a specified number of rounds (e.g., 10)
    const salt = await bcrypt.genSalt(10);
    const length = password.length;
    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with a specific _id
    const newUserId = new mongoose.Types.ObjectId().toString();
    const newUser = new userData({
      _id: newUserId,
      email,
      password: hashedPassword,
      name,
      password_length: length,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Create and assign a token for the newly registered user
    const token = jwt.sign({ email: newUser.email }, process.env.JWT_SECRET);
    res.cookie("token", token, { httpOnly: true });

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await userData.findOne({ email });
  console.log("User:", user); // Debug: Log user

  if (!user) return res.status(400).json({ message: "Email is not found" });

  try {
    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Password Comparison Result:", validPassword); // Debug: Log password comparison result

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Create and assign a token using the user's ID
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log("Generated Token:", token); // Debug: Log generated token

    // Set the token in a cookie with httpOnly option
    res.cookie("token", token, { httpOnly: true });

    res.send(user._id);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error during login" });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  // Clear the token cookie to log out the user
  res.clearCookie("token");

  // Return a response indicating successful logout
  res.json({ message: "Logged out successfully" });
});

//localhost:3001/cashcalc/income/:id
router.put("/income/:id", async (req, res) => {
  console.log("Request Body:", req.body);
  const { source, category, date, incomeAmount } = req.body;
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add monthly income entry
    user.monthly_income.push({ source, category, date, incomeAmount });
    await user.save();

    res.json(user.monthly_income);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error updating monthly income" });
  }
});

//localhost:3001/cashcalc/expenses/:id
router.put("/expenses/:id", async (req, res) => {
  console.log("Request Body:", req.body);
  const { recipient, category, date, expenseAmount } = req.body;
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add monthly expense entry
    user.monthly_expenses.push({ recipient, category, date, expenseAmount });
    await user.save();

    res.json(user.monthly_expenses);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error updating monthly expenses" });
  }
});

//localhost:3001/cashcalc/budget/:id
router.put("/budget/:id", async (req, res) => {
  console.log("Request Body:", req.body);
  const { budget } = req.body;
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update budget
    user.budget = budget;
    await user.save();

    res.json(user.budget);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error updating budget" });
  }
});

//localhost:3001/cashcalc/total_income/:id
router.put("/total_income/:id", async (req, res) => {
  console.log("Request Body:", req.body);
  const { total_income } = req.body;
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update total income
    user.total_income = total_income;
    await user.save();

    res.json(user.total_income);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error updating total income" });
  }
});

//localhost:3001/cashcalc/total_expenses/:id
router.put("/total_expenses/:id", async (req, res) => {
  console.log("Request Body:", req.body);
  const { total_expenses } = req.body;
  try {
    const user = await userData.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update budget
    user.total_expenses = total_expenses;
    await user.save();

    res.json(user.total_expenses);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error updating total expenses" });
  }
});

//localhost:3001/cashcalc/expenses/need/:expenseid
router.put("/expenses/need/:expenseid", async (req, res) => {
  console.log("request params:", req.params);
  console.log("Request Body:", req.body);
  const expenseId = req.params.expenseid;
  req.body._id = expenseId;
  try {
    const result = await userData.findOneAndUpdate(
      {'monthly_expenses._id': expenseId},
      {$set:{'monthly_expenses.$': req.body}},
      {new: true}
    );
    console.log(result);
    if(result){
      res.json(result);
    } else {
      res.status(404).json({error: 'Something went wrong'});
    }
  }
  catch(error){
    console.log(`Error: ${error.message}`);
    res.status(500).json({ message: "Error updating need" });
  }
});

router.get('/getUserData/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userData.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the required fields
    const { name, email, password_length } = user;

    // Send the response
    res.json({
      name,
      email,
      password_length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
