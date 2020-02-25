const express = require('express');
const path = require('path');
const app = express();
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
app.use(bodyParser.json());

//routes path
const loginRouter = require("./src/routes/loginRoutes");
// const registerRouter = require("./src/routes/registerRoutes");

app.use("/", loginRouter);
// app.use("/", registerRouter);


app.listen(PORT, () => console.log("server started on port", PORT));