// const multer = require("multer");
// const path = require("path");

// //storage configuratin
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); //specifitying the folder to store upload files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage: storage,
// });

// module.exports = upload;
