const User = require("../modal/userModal");
const jwt = require("jsonwebtoken");

// 1) SIGNIN
exports.signup = async function (req, res) {
  try {
    const { name, email, password, profileImage } = req.body;
    const hashedPassword = await User.hashPassword(password);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
    });
    res.status(201).json({
      status: "sucees",
      data: { newUser },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
      stack: err.stack,
    });
  }
};

// LOGIN )
exports.login = async function (req, res) {
  try {
    console.log("requestttt" + req);
    const { email, password } = req.body;
    // 1) finding the user with email
    const user = await User.findOne({ email: email });
    if (!user) throw new Error(`No such user found.`);

    //comparing the passwor
    const isPasswordValid = await user.comparePassword(password);

    //GENERATING A TOKEN
    const TOKEN = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    if (isPasswordValid) {
      //-- SENDING THE TOKEN AND WRAPING IN COOKIE
      res.cookie("token", TOKEN, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 dayyyyy
      });

      res.status(200).json({
        status: "success",
        data: "Succesfully logged in",
        user: {
          name: user?.name,
          email: user?.email,
        },
      });
    } else throw new Error("Invalid Login credentials");
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
      stack: err.stack,
    });
  }
};
