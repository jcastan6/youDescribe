const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

//routes path
const loginRouter = require("./src/routes/loginRoutes");
const registerRouter = require("./src/routes/registerRoutes");
const choose_homeRouter = require("./src/routes/choose_homeRoutes");
const homeRouter = require("./src/routes/homeRoutes");
const trainingRouter = require("./src/routes/trainingRoutes");
const training1Router = require("./src/routes/training1Routes");

app.use("/", loginRouter);
app.use("/", registerRouter);
app.use("/", homeRouter);
app.use("/", choose_homeRouter);
app.use("/", trainingRouter);
app.use("/", training1Router);

app.listen(PORT, () => console.log("server started on port", PORT));