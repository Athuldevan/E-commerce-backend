const jwt = require("jsonwebtoken");
const User = require("../modal/userModal");

async function authenticateUser(req, res, next) {
  try {
    const { token } = req.cookies;
    if(!token) throw new Error('No such user found .Please Login first')
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userId } = decodedToken;
    const user = await User.findById({ _id: userId });
   if(!user) throw new Error('No user found.Please Login first')

    if (token) {
      next();
    } else throw new Error("Login required.Please Login");
  } catch (err) {
    res.status(401).json({
      status: "failed",
      message: err.message,
      stack: err.stack
    });
  }
}

module.exports = { authenticateUser };
