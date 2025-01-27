const express = require("express");
const path = require("path");
const { User } = require("./src/models/user.js");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var expressValidator = require("express-validator");
const db = require("../application/src/sequelize-models/index.js");

const PORT = 3000;


if(process.env.NODE_ENV == 'development') {
  var options = {
    database: "captionrater",
    user: "root",
    port: 3306,
    password: "root",
    host: "localhost",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
} else {
  var options = {
    database: "captionrater",
    user: "root",
    port: 3306,
    password: "8@Af6o96FFIk",
    host: "localhost",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

var sessionStore = new MySQLStore(options);
const app = express();

// logs requests to the backend
const morgan = require("morgan");
app.use(morgan("tiny"));
app.use(express.static("public"));

// sets view engine for ejs
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
// allows to parse body in http post requests
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(bodyParser.json());

// use express session
app.use(
  session({
    secret: "CSC Class",
    saveUninitialized: false,
    store: sessionStore,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

console.log(path.join(__dirname, 'src/gifs'))
app.use(express.static(path.join(__dirname, 'src/gifs')))

//routes path
const loginRouter = require("./src/routes/loginRoutes");
const homeRouter = require("./src/routes/homeRoutes");
const choosePlayRouter = require("./src/routes/playRoutes");
const dashboardRouter = require("./src/routes/dashboardRoutes");
const trainingRouter = require("./src/routes/trainingRoutes");
const insertDataRouter = require("./src/routes/insertData");
const leaderboardRouter = require("./src/routes/leaderboardRoutes");
const extractDataRouter = require("./src/routes/extractData");

app.use("/images", express.static(path.join(__dirname, 'src/flickr8kImages')));
app.use("/gifs", express.static(path.join(__dirname, 'src/gifs')));


app.use("/", loginRouter);
app.use("/", homeRouter);
app.use("/", choosePlayRouter);
app.use("/", dashboardRouter);
app.use("/", trainingRouter);
app.use("/", insertDataRouter);
app.use("/", leaderboardRouter);
app.use("/", extractDataRouter);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      const isValid = User.findUser(email, password);
      console.log("isvalid? " + isValid);
      console.log("email is: " + email);
      console.log("password is: " + password);

      isValid.then((res) => {
        if (res != false) {
          return done(null, res);
        }

        return done(null, false, { message: "Invalid email or password." });
      });
    }
  )
);

app.listen(PORT, () => console.log("server started on port", PORT));
