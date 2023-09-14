const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const port = process.env.PORT || 8000;
require("dotenv").config();
const DB = process.env.DB;
const userRouter = require("./routes/userRoute");

const app = express();
app.use(express.json());

mongoose
  .connect(DB)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.error(err.message);
  });

app.use(function (req, res, next) {
  res.setHeader("Access-Contorl-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,PUT,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use("/user", userRouter);

app.listen(port, () => {
  console.log("App is Running in this port", `${port}`);
});
