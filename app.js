const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("node:fs");

const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const cartRouter = require("./routes/cartRouter");
const wishlistRouter = require("./routes/wishlistRouter");
const orderRouter = require("./routes/orderRouter");
const checkoutRouter = require("./routes/checkoutRouter");
const adminRouter = require("./routes/adminRouter");

//

// app.use((req, res, next) => {
//   // console.log("Origin:", req.headers.origin);
//   console.log("URL : " + req.url);
//   next();
// });

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/admin", adminRouter);

//404 error handling middleware
app.use((err, req, res, next) => {
  return res.status(404).json({
    status: "Cant't find the url.",
    message: err.message,
  });
});

module.exports = app;
