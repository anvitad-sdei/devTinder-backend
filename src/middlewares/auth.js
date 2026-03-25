const jwt = require("jsonwebtoken");
const User = require("../model/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token!!!");
    }
    const decodedMessage = await jwt.verify(token, "Krishnavi2025*#");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exists!!");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error :" + error.message);
  }
};

module.exports = {
  userAuth,
};
