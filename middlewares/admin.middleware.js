// Admin middleware
exports.adminProtect = async function (req, res, next) {
  try {
    if (req.user && req.user === "admin") {
      next();
    } else {
      throw new Error(
        "Access denied.This action can be performed by admins only"
      );
    }
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};
