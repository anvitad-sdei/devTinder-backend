const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequest");
const userRouter = express.Router();
const User = require("../model/user");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  //Gt all the pending connection request for loggedin user
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    //.populate("fromUserId","firstName lastName",)  //second way
    res
      .status(200)
      .json({ data: connectionRequest, message: "Fetched Successfully!" });
  } catch (err) {
    return res.status(400).send("Error " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const connectionRequest = await ConnectionRequest.find({
    $or: [
      { fromUserId: loggedInUser._id, status: "accepted" },
      { toUserId: loggedInUser._id, status: "accepted" },
    ],
  })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);

  const data = connectionRequest.map((row) => {
    if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
      return row.toUserId;
    }
    return row.fromUserId;
  });
  res.json({ data, message: "Succesfully fetch!!" });
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //user should see all the user cards except
    //1. his own card
    //2. his connections
    //3. ignored people
    //4.already sent the connection request
    const page = req.query.page || 1;
    let limit = req.query.limit || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        // { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.send(users);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
