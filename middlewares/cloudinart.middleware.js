const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dskntx5yo",
  api_key: "746836881597641",
  api_secret: "UcZVa38cozXfLEulWRqmaE3SC-Y",
  // secure_distribution: 'mydomain.com',
  // upload_prefix: 'https://api-eu.cloudinary.com'
});

// Define storage engine for Multer using Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
