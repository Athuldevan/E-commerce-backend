const User = require("../modal/userModal");

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
    const { email, password } = req.body;
    // 1) finding the user with email
    const user = await User.findOne({ email: email });
    if (!user) throw new Error(`No such user found.`);

    //comparing the passwor
    const isPasswordValid = await user.comparePassword(password);

    if (isPasswordValid) {
      res.status(200).json({
        status: "success",
        data: isPasswordValid,
      });
    }else throw new Error('Invalid Login credentials')
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message,
      stack: err.stack,
    });
  }
};
