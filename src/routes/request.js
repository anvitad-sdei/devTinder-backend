const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendUserConnection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

module.exports = requestRouter;
