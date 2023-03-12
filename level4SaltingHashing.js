//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/userDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(
  "mongodb+srv://NovaKing:keydb@cluster0.ae46b4r.mongodb.net/authDB",
  { useNewUrlParser: true }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// const secret = process.env.SECRET;

// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] }); // kisse encrypt karna and kya encrypt karna

// //automaticly encrypt with we save and decrypt when we find

const User = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const username = req.body.username;
    const password = hash;

    const newUser = new User({
      email: username,
      password: password,
    });

    newUser.save();
    res.render("secrets");
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  {
    //   User.findOne({ email: username }, function (err, foundOne) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       if (foundOne) {
    //         if (foundOne.password === password) {
    //           res.render("secrets");
    //         }
    //       }
    //     }
    //   });
  }

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost:27017/userDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(
  "mongodb+srv://NovaKing:keydb@cluster0.ae46b4r.mongodb.net/authDB",
  { useNewUrlParser: true }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// const secret = process.env.SECRET;

// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] }); // kisse encrypt karna and kya encrypt karna

// //automaticly encrypt with we save and decrypt when we find

const User = new mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const username = req.body.username;
    const password = hash;

    const newUser = new User({
      email: username,
      password: password,
    });

    newUser.save();
    res.render("secrets");
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  {
    //   User.findOne({ email: username }, function (err, foundOne) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       if (foundOne) {
    //         if (foundOne.password === password) {
    //           res.render("secrets");
    //         }
    //       }
    //     }
    //   });
  }

  User.findOne({ email: username })
    .then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result === true) {
            res.render("secrets");
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
