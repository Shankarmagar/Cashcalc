const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

function connectDatabase() {
  mongoose
    .connect(process.env.URI)
    .then(() => console.log(`connected: ${mongoose.connection.host}`)) //displays connection
    .catch((error) => {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = connectDatabase;
