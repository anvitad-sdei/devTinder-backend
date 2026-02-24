//starting point of application

const express = require("express");

const app = express();

// if we will create url like thie ab?c then in this case "b" is optional if wew pass in url /ac or /abc in both scenerio it will work
// ab+c then "b" can add as many of times like "abbbc" will work
// ab*cd this means you can add any text between ab and cd but pattern should be match starting with ab and end with cd.
// a(bc)?d in this case "bc" is optional
// /a/ in url a letter exits then url will work
app.get("/abc", (req, res) => {
  res.send({ firstName: "Krishnavi", lastName: "Dixit" });
});

//get() method to match only GET method api call to 'user'
app.get("/user", (req, res) => {
  console.log(req.query); // req.query will print the value pass the in the url like ?id
  res.send({ firstName: "Krishnavi", lastName: "Dixit" });
});

// :(colons) means dynamic routes
app.get("/user/:userId", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Krishnavi", lastName: "Dixit" });
});

app.post("/user", (req, res) => {
  //Store the data into DB
  res.send("Successfully saved data!");
});

app.delete("/user", (req, res) => {
  res.send("delete data");
});

// use() method will match the all HTTP method API calls
app.use("/hello", (req, res) => {
  res.send("Hello hello hello from the server radha rani!");
});

app.listen(3000, () => {
  console.log("server is successfully listening on port 3000");
});
