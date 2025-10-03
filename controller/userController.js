const User = require("../modal/userModal");
const Order = require("../modal/orderModal");

//GET ALL USERS
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
///////////////////////////////////////////////////////////////////

//View Profile
exports.viewProfile = async function (req, res) {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(400).json({
        status: "failed",
        message: "Please Login first.",
      });
    }

    const totalOrders = await Order.aggregate([
      {
        $match: {
          userId: loggedInUser._id,
        },
      },

      {
        $unwind: "$products",
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: "Success",
      data: {
        user: loggedInUser,
        totalOrders,
      },
    });
  } catch (err) {}
};
