const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus) {
        return res.status(400).json({ message: "Invalid status type" });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "USer not found!!" });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.status(400).json({ message: "User already exists!!" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  },
);

module.exports = requestRouter;
