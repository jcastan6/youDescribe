const express = require('express');
const path = require('path');
const app = express();
var expressValidator = require("express-validator");
const PORT = 3000;

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

//routes path
const loginRouter = require("./src/routes/loginRoutes");
const homeRouter = require("./src/routes/homeRoutes");
const chooseHomeRouter = require("./src/routes/chooseHome");

app.use("/", loginRouter);
app.use("/", homeRouter);
app.use("/", chooseHomeRouter);


app.listen(PORT, () => console.log("server started on port", PORT));