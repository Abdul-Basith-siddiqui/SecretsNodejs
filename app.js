//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const key = process.env.SECRET;
app.use(
  session({
    secret: key,
    resave: false, //resave to false means that the session will not be saved if it wasn't modified, which can improve performance and prevent unnecessary database writes.
    saveUninitialized: false, // saveUninitialized to false means that a session will not be created unless there is data to be stored, which can also help to optimize performance and reduce storage requirements.
  })
);

app.use(passport.initialize()); //middleware is used to initialize Passport and set up the authentication strategies , It adds the passport object to the req (request) object of each incoming HTTP request, which can then be used in later middleware to authenticate the user.
app.use(passport.session()); // The passport.session() middleware adds support for  user sessions using cookies.

mongoose.connect(
  `mongodb+srv://NovaKing:${process.env.PASS}@cluster0.ae46b4r.mongodb.net/authDB`,
  { useNewUrlParser: true }
);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: String,
});

userSchema.plugin(passportLocalMongoose); //use for hash and salt the password and store user in database

const User = new mongoose.model("user", userSchema);

passport.use(User.createStrategy()); // This line of code sets up the passport-local strategy with the User model, using the createStrategy() method provided by passport-local-mongoose. to authenticate usernmae and password of user

passport.serializeUser(User.serializeUser()); //When a user logs in, the serializeUser() method is called to save the user's ID to the session. When subsequent requests are made,
passport.deserializeUser(User.deserializeUser()); // the deserializeUser() method is called to retrieve the user's data based on the saved ID and make it available in the req.user object.

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  // if (req.isAuthenticated()) {
  //   res.render("secrets");
  // } else {
  //   res.redirect("/login");
  // }

  User.find({ secret: { $ne: null } }, (err, foundSecrets) => {
    if (err) {
      console.log(err);
    } else {
      if (foundSecrets) {
        res.render("secrets", { userWithSecrets: foundSecrets });
      }
    }
  });
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/submit", (req, res) => {
  const userSecret = req.body.secret;
  console.log(req.user); // user is the object of userSchema,  when user is logged in, passport automatically add user object to req.user

  User.findById(req.user.id, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = userSecret;
        foundUser.save(() => {
          res.redirect("/secrets");
        });
      }
    }
  });
});

app.post("/register", (req, res) => {
  User.register(
    //register method is provided by passport-local-mongoose
    { username: req.body.username },
    req.body.password,
    (err, user) => {
      //user is the object of userSchema
      if (err || req.body.password !== req.body.passwordAgain) {
        console.log(err);
        res.redirect("/register");
        // res.render("register.ejs", { error: "err" });
      } else {
        passport.authenticate("local")(req, res, () => {
          //authenticate method is provided by passport-local-mongoose
          res.redirect("/secrets");
        });
      }
    }
  );
});

// app.post("/register", (req, res) => {
//   User.register({ username: req.body.username }, req.body.password)
//     .then(() => {
//       passport.authenticate("local")(req, res, () => {
//         res.redirect("/secrets");
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.redirect("/register");
//     });
// });

app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    //login method is provided by passport
    if (err) console.log(err);
    else {
      passport.authenticate("local")(req, res, () => {
        //authenticate method is provided by passport-local-mongoose
        res.redirect("/secrets");
      });
    }
  });
});

app.listen(3001, function () {
  console.log("Server started on port 3000");
});

/*
In a Node.js web application, the code app.use(passport.initialize()) and app.use(passport.session()) initialize and configure a middleware called Passport.

Passport is an authentication middleware for Node.js web applications, that provides a set of strategies for authenticating users with various types of credentials, such as username/password, social media accounts, or other authentication providers. Passport provides an abstraction layer that makes it easy to authenticate users with different strategies, while still keeping a consistent user session state across the different strategies.

The passport.initialize() middleware is used to initialize Passport and set up the authentication strategies. It adds the passport object to the req (request) object of each incoming HTTP request, which can then be used in later middleware to authenticate the user.

The passport.session() middleware adds support for persistent user sessions using cookies. It deserializes the user object from the session data and attaches it to the req.user object. This allows for seamless authentication across different pages and requests within the web application, as the user's authentication state is stored on the server-side and can be retrieved on subsequent requests.

In summary, app.use(passport.initialize()) initializes the Passport middleware and sets up the authentication strategies, while app.use(passport.session()) adds support for persistent user sessions using cookies, allowing for seamless authentication across different requests and pages of the web application.





explain   passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport is an authentication middleware for Node.js that provides a powerful and flexible mechanism for handling user authentication in web applications.

In order to use passport, we need to configure a strategy for authenticating users. The strategy is responsible for verifying user credentials and returning a user object if authentication is successful.

passport-local is a strategy that can be used to authenticate users based on a username and password. It requires a verify function that takes a username and password and returns a user object if authentication is successful.

passport-local-mongoose provides a pre-defined strategy for authenticating users that use the User model with the passport-local strategy. The createStrategy() method returns a function that can be used to authenticate users with the passport-local strategy.

less

passport.use(User.createStrategy());
This line of code sets up the passport-local strategy with the User model, using the createStrategy() method provided by passport-local-mongoose.

The serializeUser() and deserializeUser() methods are used to store and retrieve user data in sessions.

When a user logs in, the serializeUser() method is called to save the user's ID to the session. When subsequent requests are made, the deserializeUser() method is called to retrieve the user's data based on the saved ID and make it available in the req.user object.

less

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
These lines of code configure the passport middleware to use the serializeUser() and deserializeUser() methods provided by the passport-local-mongoose plugin for the User model. This allows passport to store and retrieve user data in sessions.


*/
