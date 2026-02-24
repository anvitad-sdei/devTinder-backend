//starting point of application

const express = require("express");

const app = express();

//get() method to match only GET method api call to 'user'
app.get("/user", (req, res) => {
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
