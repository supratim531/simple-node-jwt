const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const handleError = require("./middlewares/errorHandler");

const app = express();

const PORT = process.env.PORT || 8888;

connectDb();
app.use(express.json());
app.use("/api/v1/user", require("./routes/userRoute"));
app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
