const express = require("express");
const color = require("cli-color");
const mysql = require("mysql");

const app = express();

app.listen(3500, () => {
  console.log(color.white("Server Connected!!!"));
});

const dbconnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee",
});

dbconnect.connect(() => console.log(color.white("Database Connected")));

app.get("/", (req, res, next) => {
  res.send("Testing............................");
});

app.get("/api/person", (req, res, next) => {
  dbconnect.query("select * from person", (error, result) => {
    res.status(200).json({
      status: true,
      message: "User fetched successfully!!",
      data: result,
    });
  });
});
