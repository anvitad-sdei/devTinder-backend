//starting point of application

const express = require("express");

const app = express();

app.use("/get", (req, res) => {
  res.send("Hello from the server!");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello from the server radha rani!");
});

app.listen(3000, () => {
  console.log("server is successfully listening on port 3000");
});
