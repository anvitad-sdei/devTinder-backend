//starting point of application

const express = require("express");
const { adminAuth } = require("./middlewares/auth");
const { connectDB } = require("./config/database.js");
const app = express();
const User = require("./model/user");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");
const userRouter = require("./routes/user.js");

// if we will create url like thie ab?c then in this case "b" is optional if wew pass in url /ac or /abc in both scenerio it will work
// ab+c then "b" can add as many of times like "abbbc" will work
// ab*cd this means you can add any text between ab and cd but pattern should be match starting with ab and end with cd.
// a(bc)?d in this case "bc" is optional
// /a/ in url a letter exits then url will work
// app.get("/abc", (req, res) => {
//   res.send({ firstName: "Krishnavi", lastName: "Dixit" });
// });

// //get() method to match only GET method api call to 'user'
// app.get("/user", (req, res) => {
//   console.log(req.query); // req.query will print the value pass the in the url like ?id
//   res.send({ firstName: "Krishnavi", lastName: "Dixit" });
// });

// :(colons) means dynamic routes
// app.get("/user/:userId", (req, res) => {
//   console.log(req.params);
//   res.send({ firstName: "Krishnavi", lastName: "Dixit" });
// });

// app.post("/user", (req, res) => {
//   //Store the data into DB
//   res.send("Successfully saved data!");
// });

// app.delete("/user", (req, res) => {
//   res.send("delete data");
// });

// use() method will match the all HTTP method API calls
// app.use("/hello", (req, res) => {
//   res.send("Hello hello hello from the server radha rani!");
// });

// app.use("/user1", (req, res) => {
//   //If you are not sending any response from the server then after sometime timeout will happen
// });

// we can call multiple route handler and for next route handler we have one another parameter next to pass
// app.use(
//   "/user2",
//   (req, res, next) => {
//     // res.send("response1");
//     console.log("response 1!");
//     next();
//   },
//   [
//     (req, res, next) => {
//       console.log("response 2!");
//       next();
//     },
//     (req, res, next) => {
//       console.log("response 3!");
//       next();
//     },
//   ],
//   (req, res, next) => {
//     console.log("response 4!");
//     // res.send("response4");
//     next();
//   },
//   (req, res, next) => {
//     console.log("response 5!");
//     res.send("response5");
//   },
// );

// what is middleware and why do we need
// middleware are the multiple route handler defined inside the function

// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res) => {
//   res.send("all data sent");
// });

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
//Get  users by emailId

app.get("/user", async (req, res) => {
  const userEmailId = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmailId });
    if (users.length === 0) {
      res.status(404).send("Not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//get all users

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//delete api

app.delete("/delete", async (req, res) => {
  const emailId = req.body.emailId;
  console.log(req, "req");
  try {
    const users = await User.deleteOne({ emailId: emailId });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//user update

app.patch("/updateUser/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("Updated Successfully");
  } catch (err) {
    res.status(400).send("Update Failed!" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("connected successfully");
    app.listen(3000, () => {
      console.log("server os runing");
    });
  })
  .catch((err) => {
    console.log("error coonection");
  });
