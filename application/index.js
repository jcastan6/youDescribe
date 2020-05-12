const express = require('express');
const path = require('path');
const { User } = require("./src/models/user.js");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var expressValidator = require("express-validator");

const PORT = 3002;


var options = {
  database: "db",
  user: "ubuntu",
  port:3306,
  password: "1235012350",
  host: "54.183.110.192",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  };

  
  var sessionStore = new MySQLStore(options);
  const app = express();

// logs requests to the backend
const morgan = require("morgan");
app.use(morgan("tiny"));

// sets view engine for ejs
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');
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
      resave: false
    })
  );

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("./public"));

//routes path
const loginRouter = require("./src/routes/loginRoutes");
const homeRouter = require("./src/routes/homeRoutes");
const choosePlayRouter = require("./src/routes/playRoutes");
const dashboardRouter = require("./src/routes/dashboardRoutes");
// const trainingRouter = require("./src/routes/trainingRoutes");
const insertDataRouter = require("./src/routes/insertData");
const leaderboardRouter = require("./src/routes/leaderboardRoutes");

app.use("/service2/", loginRouter);
app.use("/service2/", homeRouter);
app.use("/service2/", choosePlayRouter);
app.use("/service2/", dashboardRouter);
// app.use("/", trainingRouter);
app.use("/service2/",insertDataRouter);
app.use("/service2/",leaderboardRouter);



passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      function(email, password, done) {
        const isValid = User.findUser(email, password);
        console.log("isvalis? "+isValid);
        console.log('email is: '+email);
        console.log('password is: '+password);


        isValid.then(res => {
          if (res != false) {
            return done(null, res);
          }

  
          return done(null, false, { message: "Invalid email or password." });
        });
      }
    )
  );


app.listen(PORT, () => console.log("server started on port", PORT));
