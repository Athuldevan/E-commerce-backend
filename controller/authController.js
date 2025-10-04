const crypto = require("node:crypto");
const User = require("../modal/userModal");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utility/emial");

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

//Forgot password
exports.forgotPassword = async function (req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No such user found",
      });
    }
    const resetPasswordToken = user.createResetPasswordToken();
    await user.save();
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetPasswordToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}\n\nIf you didn't request a password reset, please ignore this email.`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "Success",
      message: "Token sent succesfully",
    });
  } catch (err) {
    res.status(403).json({
      status: "failed",
      message: err.message,
    });
  }
};

//RESET PASSWORD
exports.resetPassword = async function (req, res) {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    console.log(hashedToken, "hashed token");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      // passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "No such user found",
      });
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //After editing the password the jwt token is issued  again to the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "90d",
    });

    res.status(200).json({
      status: "success",
      token,
      message: "Password updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
