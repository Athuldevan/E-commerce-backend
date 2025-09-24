const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      maxLength: 12,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "A user must have a email"],
      unique: [true, "A user  with this email already exists"],
      lowerCase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    password: {
      type: String,
      required: [true, "A user need a password"],
      trim: true,
      minLength: 6,
    },

    profileImage: {
      type: String,
      default: "https://avatar.iran.liara.run/public/5",
    },
  },
  { timestamps: true }
);

//bycrypt password method
userSchema.statics.hashPassword = async function (userPassword) {
  return await bcrypt.hash(userPassword, 8);
};

//comparing hashed password
userSchema.methods.comparePassword = async function (typedPassword) {
  return await bcrypt.compare(typedPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
