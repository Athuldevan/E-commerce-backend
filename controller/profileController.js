const Order = require("../modal/orderModal");

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
      //first stage
      {
        $match: {
          userId: loggedInUser._id,
        },
      },

      {
        $unwind : '$products'
      },
     {
      $group : {
        _id : null,
        totalOrders : {$sum : 1}
       
      }
     }
     

      // {
      //   $count : 'products.'
      // }
    ]);
    // const totalOrders = await Order.find({
    //   userId: loggedInUser._id,
    // }).populate("products.productId");
    // console.log(totalOrders);

    res.status(200).json({
      status: "Success",
      data: {
        user: loggedInUser,
        totalOrders,
      },
    });
  } catch (err) {}
};
