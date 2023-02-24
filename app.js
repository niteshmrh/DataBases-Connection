const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const color = require("cli-color");
const mysql = require("mysql");
const moment = require("moment");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// console.log("hiiiii", date);
// console.log("curr_time", curr_time);

// app.listen(3500, () => {
//   console.log(color.white("Server Connected!!!"));
// });

const dbconnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee",
});

dbconnect.connect(() => console.log(color.white("Database Connected")));

// ******************** Testing the home page that :- it gives output or not
app.get("/", (req, res, next) => {
  res.send("Testing............................", date);
});

//*********************** getting all the data from  the table ***************************

app.get("/api/person", (req, res, next) => {
  dbconnect.query(
    "select * from person where isDeleted='N'",
    (error, result) => {
      if (error) {
        return res.send({
          error: true,
          message: error.sqlMessage,
          data: null,
        });
      }
      res.status(200).json({
        status: true,
        message: "User fetched successfully!!",
        data: result,
      });
    }
  );
});

//***************  getting particular data from the sql ************************

app.get("/api/person/:id", (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Please provide user id",
      data: null,
    });
  }
  dbconnect.query(
    "select * from person where personId =  ? AND isDeleted='N' ",
    [id],
    (error, result) => {
      if (error) {
        return res.status(403).json({
          error: true,
          message: error.sqlMessage,
          data: null,
        });
      }
      console.log(result);

      res.status(200).json({
        status: true,
        message: "User fetched successfully!!",
        data: result,
      });
    }
  );
});

//******************** inserting data into database person*****************************/

app.post("/api/person", (req, res, next) => {
  var person = req.body.data[0];
  var curr_time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  console.log(curr_time);
  // console.log(person.Name);
  if (!person) {
    return res.status(400).json({
      error: true,
      message: "Please provide person",
      data: null,
    });
  }
  // ${person.personId} personId,
  dbconnect.query(
    `INSERT INTO person (Name, Email, Pan, Mobile, Aadhar, Created_Time, Updated_Time) VALUES ('${person.Name}', '${person.Email}', '${person.Pan}', '${person.Mobile}', '${person.Aadhar}', '${curr_time}', '${curr_time}')`,
    (error, results, fields) => {
      if (error) {
        return res.status(403).json({
          error: true,
          message: error.sqlMessage,
          data: null,
        });
      }
      return res.status(201).json({
        error: false,
        message: "User create successfully!!",
        data: `Person Id ${results.insertId} inserted`,
      });
    }
  );
});

//*********** Delete data fropm the databases *******************************************

app.delete("/api/person/:id", (req, res, next) => {
  const id = req.params.id;
  console.log("hiiiiiiii deleted----", id);
  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Please provide User Id",
      data: null,
    });
  }

  dbconnect.query(
    "UPDATE person SET isDeleted = 'Y' WHERE personId = ?",
    [id],
    (error, results, feilds) => {
      if (error) {
        return res.status(403).json({
          error: true,
          message: error.message,
          data: null,
        });
      }
      return res.status(200).json({
        error: false,
        message: "Person Deleted Successfully",
      });
    }
  );
});

//***************************** Update data of particular feilds *******************************************

app.put("/api/person/:id", (req, res, next) => {
  const id = req.params.id;
  // console.log(id);
  // console.log("data---", req.body);
  var person = req.body.data[0];
  // console.log(person);
  var person = req.body.data[0];
  var updated_time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  if (!id || !person) {
    return res.status(400).json({
      error: true,
      message: "Please provide person & person id",
      data: null,
    });
  }
  dbconnect.query(
    `UPDATE person SET Name='${person.Name}', Email='${person.Email}', Pan='${person.Pan}',Mobile='${person.Mobile}',Aadhar='${person.Aadhar}',Updated_Time='${updated_time}' WHERE personId = ${id}`,
    (error, results, feilds) => {
      if (error) {
        return res.status(403).json({
          error: true,
          message: error.message,
          data: null,
        });
      }
      return res.status(200).json({
        error: false,
        message: "User Update Successfully!!",
      });
    }
  );
});

module.exports = app;
