const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const color = require("cli-color");
const mysql = require("mysql");
const moment = require("moment");
// const multer = require("multer");
const puppeteer = require("puppeteer");
const hbs = require("handlebars");
const fs = require("fs-extra");
const path = require("path");

const { body, validationResult } = require("express-validator");
const { Template } = require("ejs");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const [person, setPerson] = useState([]);

let person = {};

// app.set("view engin", "ejs");
// console.log("hiiiii", date);
// console.log("curr_time", curr_time);
// app.listen(3500, () => {
//   console.log(color.white("Server Connected!!!"));
// });

//

//*************************** DataBase Connection ******************************************/
const dbconnect = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee",
});
dbconnect.connect(() => console.log(color.white("Database Connected")));

// ******************** Testing the home page that :- it gives output or not

app.get("/", (req, res, next) => {
  res.send("Testing............................");
});

//************** multer ******************************** */

// const storage = multer.diskStorage({
//   destination: (req, res, cb) => {
//     cb(null, "/");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     cb(null, Date.now() + this.path.extname(file.Images.orignalname));
//   },
// });

// const upload = multer({ storage: storage });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "Images/");
//   },
//   filename: function (req, file, cb) {
//     console.log("filessss", file);
//     // return;
//     // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     let myfilename = Date.now() + file.fieldname + "-" + file.originalname;
//     req.body.myfilename = myfilename;
//     cb(null, myfilename);
//   },
// });

// const upload = multer({ storage: storage });

//*********************** getting all the data from  the table ***************************

app.get("/api/person", (req, res, next) => {
  console.log(req.query);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  dbconnect.query(
    `select * from person where isDeleted='N' limit ${limit} offset ${skip}`,
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
        message: "User fetched successfully!!1",
        data: result,
      });
    }
  );
});

//*************** Getting total Number of entyies in DataBase ************************* */

app.get("/api/person/count/users", (req, res) => {
  // console.log("count-----");
  dbconnect.query(
    "select count(*) as length from person where isDeleted='N'",
    (error, result) => {
      if (error) {
        return res.status(403).json({
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

//**************************************************************** */

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
      person = result;
      // person = JSON.stringify(result);
      // console.log("result-----", result[0].Name);
      // const jsonString = JSON.stringify(details);
      // console.log("json foramte", jsonString);
      // const details  = result;
      // console.log("details", details[0].Name);
      // console.log("person partucular------", person[0]);

      res.status(200).json({
        status: true,
        message: "User fetched successfully!!2",
        data: result,
      });
    }
  );
});

// var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/; pan card validation

//******************** POST inserting data into database person*****************************/
// upload.single("Photo"),
// , '${req.body.myfilename}'

app.post(
  "/api/person",
  body("Name").isLength({ max: 50, min: 3 }).withMessage("Enter a  valid Name"),
  body("Email").isEmail().isLength({ max: 50 }),

  body("Pan", "Enter a valid Pan Number").matches(
    /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/,
    "i"
  ),
  body("Aadhar")
    .isLength(12)
    .withMessage("Enter 12 digit valid Aadhar card Number"),
  body("Mobile")
    .isLength({
      max: 13,
      min: 10,
    })
    .withMessage("Enter 10 digit Mobile Number width +91"),
  // body("Photo").is.withMessage("Enter Photo as Jpg/Jpeg"),
  (req, res) => {
    // return;
    // var person = req.body.data[0];
    // const patternEmail = /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;
    // const patternPan = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    // const patternMobile = /^[+]{1}[9]{1}[1]{1}[9876][0-9]{9}$/;
    // const patternAadhar = /^[0-9]{12}$/;

    // if (person.Name == "") {
    //   return res.send("Enter Name");
    // }
    // if (!person.Email.match(patternEmail)) {
    //   return res.send("Enter valid email");
    // }
    // if (!person.Pan.match(patternPan)) {
    //   return res.send("Enter Valid Pan Number");
    // }
    // if (!person.Mobile.match(patternMobile)) {
    //   return res.send("Enter Valid 10 digit mobile Number using +91");
    // }
    // if (!person.Aadhar.match(patternAadhar)) {
    //   return res.send("Enter Valid 12 digit  Aadhar Card Number");
    // }
    // const { Photo } = req.files;
    const errors = validationResult(req);

    // console.log(Photo);
    // console.log(errors);
    // console.log(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    var person = req.body;
    // console.log("photo-----", person);
    var curr_time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    // console.log(curr_time);
    // console.log(person.Name);

    // ${person.personId} personId,
    // console.log(req.files);
    // return;
    // return;
    dbconnect.query(
      `INSERT INTO person (Name, Email, Pan, Mobile, Aadhar, Created_Time, Updated_Time) VALUES('${person.Name}', '${person.Email}', '${person.Pan}', '${person.Mobile}', '${person.Aadhar}', '${curr_time}', '${curr_time}')`,
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
  }
);

//*********** Delete data from the databases *******************************************

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

app.put(
  "/api/person/:id",
  body("Name").isLength({ max: 50, min: 3 }).withMessage("Enter a  valid Name"),
  body("Email").isEmail().isLength({ max: 50 }),

  body("Pan", "Enter a valid Pan Number").matches(
    /^([A-Z]){5}([0-9]){4}([A-Z]){1}$/,
    "i"
  ),
  body("Aadhar")
    .isLength(12)
    .withMessage("Enter 12 digit valid Aadhar card Number"),
  body("Mobile")
    .isLength({
      max: 13,
      min: 10,
    })
    .withMessage("Enter 10 digit Mobile Number width +91"),

  (req, res) => {
    const errors = validationResult(req);
    // console.log(errors);
    // console.log(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // console.log(id);
    console.log("data---", req.body);
    const id = req.params.id;
    // var person = req.body;
    // console.log(person);
    var person = req.body;
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
  }
);

//***************** Uploading photos in the DataBase using Post Method ******************************** */

app.put("/api/person/camera/:id", (req, res) => {
  const id = req.params.id;
  var person = req.body;
  console.log("id---", id);
  if (!id || !person) {
    return res.status(400).json({
      error: true,
      message: "Please provide person & person id",
      data: null,
    });
  }
  var updated_time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

  dbconnect.query(
    `UPDATE person SET Photo='${person.Photo}',Updated_Time='${updated_time}' WHERE personId = ${id}`,
    (error, results, fields) => {
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

//***************** PDF TEMPLATE ****************************** */

const template = (person, date) => {
  console.log("template----------", person);
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
  </head>
  <body>
      <div class="py-5">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <div class="border p-3 rounded">
                  <div class="mt-3">
                    <h1 class="mb-3 text-center">Person Information</h1>
                    <ul class="list-group">
                      <li class="list-group-item">
                        <div class="justify-content-end">
                          <img
                            class="rounded"
                            src=${person[0].Photo}
                            alt="Add image"
                            width="25%"
                            height="35%"
                            style="marginLeft: 150px; borderRadius: 50%;"
                          />
                          <span class="float-end fw-lighter text center">
                            Image
                          </span>
                        </div>
                      </li>
                      <li class="list-group-item">
                        ${person[0].Name}
                        <span class="float-end fw-lighter">Name</span>
                      </li>
  
                      <li class="list-group-item">
                        ${person[0].Email}
                        <span class="float-end fw-lighter">Email</span>
                      </li>

                      <li class="list-group-item">
                        ${person[0].Mobile}
                        <span class="float-end fw-lighter">Phone</span>
                      </li>

                      <li class="list-group-item">
                        ${person[0].Pan}
                        <span class="float-end fw-lighter">Pan </span>
                      </li>
  
                      <li class="list-group-item"> 
                        ${person[0].Aadhar}
                        <span class="float-end fw-lighter">Aadhar</span>
                      </li>
  
                      <li class="list-group-item">  
                        ${person[0].Created_Time}
                        <span class="float-end fw-lighter">Created On</span>
                      </li>
  
                      <li class="list-group-item">
                        ${person[0].Updated_Time}
                        <span class="float-end fw-lighter">Updated On</span>
                      </li>
                    </ul>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer><p style="position:absolute;bottom:0;right:0;" >${date}</p></footer>
  </body>
  </html>`;
};

//**************************************** Downloading PDF *************************************************/
// now i have to settup -------- puppeter

app.post("/api/person/download", (req, res) => {
  const { url } = req.body;
  // console.log("-----------", id);
  // const url = "http://localhost:3001/" + { id };
  // console.log("url--------", url);
  console.log("details in pdf download------", person[0].Name);

  const webpageTopdf = async () => {
    // console.log("inside webpagetopdf-----", url);
    const browser = await puppeteer.launch();
    const webpage = await browser.newPage();
    const date = new Date();
    const content = template(person, date.toUTCString());
    await webpage.setContent(content, { waitUntil: "domcontentloaded" });

    // await webpage.goto(url, {
    //   waitUntil: "domcontentloaded",
    // });

    await webpage
      .pdf({
        printBackground: true,
        displayHeaderFooter: true,
        path: "webpage.pdf",
        format: "Tabloid",
        // format: "A4",
        landscape: false,
        margin: {
          top: "10px",
          bottom: "5px",
          left: "2px",
          right: "2px",
        },
      })
      .then(() => {
        console.log("File downloaded    1");
        return res.send(url), res.status(200);
      })
      .catch((e) => {
        console.log(e);
        res.send("error in fetching url");
      });
    await browser.close();
  };

  if (url) {
    console.log("hiiiiiiiiiiii", url);
    // console.log("body -----", req.body);
    webpageTopdf();
  }
});

// Sending the pdf to the frontEnd

app.get("/api/person/download/fetch-pdf", (req, res) => {
  // console.log("/api/person/download/fetch-pdf hitted");
  res.sendFile(`${__dirname}/webpage.pdf`);
});

module.exports = app;
