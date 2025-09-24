const express = require("express");
const app = express();
const authRouter = require("./routes/authRouter");

//
app.use(express.json());

app.use("/api/v1", authRouter);


module.exports = app;
