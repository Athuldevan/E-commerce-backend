const User = require("../modal/userModal");

exports.getAllUsers = async function (req, res) {
  try {
    const allUsers = await User.find({});
    res.status(200).json({
      status: "success",
      data: {
        users: allUsers,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "messge",
      message: err.message,
    });
  }
};
