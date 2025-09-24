const express = require("express");
const app = express();
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");

//
app.use(express.json());

app.use("/api/v1", authRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
