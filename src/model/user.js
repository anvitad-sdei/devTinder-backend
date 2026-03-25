const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 25,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address:  " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter strog password!  " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid!");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.google.com/imgres?q=images&imgurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2016%2F11%2F21%2F06%2F53%2Fbeautiful-natural-image-1844362_1280.jpg&imgrefurl=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fbeautiful%2520images%2F&docid=SkB2qrN61zNZoM&tbnid=_j-dfG9y2vXXxM&vet=12ahUKEwjxi_-Yt7iTAxWZ1TgGHeSXOF8QnPAOegQIXxAB..i&w=1280&h=720&hcb=2&ved=2ahUKEwjxi_-Yt7iTAxWZ1TgGHeSXOF8QnPAOegQIXxAB",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo url:  " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Krishnavi2025*#", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(passwordByUser, user.password);
  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
