const mongoose = require("mongoose");
const app = require("./app");

const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

const PORT = 3000;

// app.listen(HOST, PORT, () => {
//   console.log("app is runnin on 3000 port ");
// });

const DB = process.env.DB;
//ev var is undefiend
if (!DB) {
  console.error("DB environment variable is not defined!");
  process.exit(1);
}

mongoose
  .connect(DB)
  .then(() => console.log("✅ Connected to Database"))
  .catch((err) => console.error("❌ Failed to connect to the database", err));

app.listen(PORT,"localhost", () => {
  console.log("Server is runnibg on   PORT  3000⌛⌛⌛ ");
});

