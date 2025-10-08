const User = require("../modal/userModal");
const Order = require("../modal/orderModal");
///////////////////////////////////////////////////////////////////

//View Profile of logged in user
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
