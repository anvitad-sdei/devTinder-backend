const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validations.js");
const bcrypt = require("bcrypt");
const User = require("../model/user.js");
//Signup API
authRouter.post("/signup", async (req, res) => {
  try {
    //Validate Data
    validateSignUpData(req);
    //Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword, "hash password");

    //Creating a new instance of user modal
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    await user.save();
    res.send("saved successfully!");
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

//Login User API

authRouter.use("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials!");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //Create a JWT token

      const token = await user.getJWT();

      //Add the token to cookie and send back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 60 * 60 * 1000),
      });
      res.send("Login successfully!");
    } else {
      throw new Error("Invalid credentials!!");
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = authRouter;
