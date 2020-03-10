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
const leaderboardRouter = require("./src/routes/leaderboardRoutes");
const dashboardRouter = require("./src/routes/dashboardRoutes");
const playRouter = require("./src/routes/playRoutes");
const trainingExample1Router = require("./src/routes/trainingExample1Routes");
const trainingExample2Router = require("./src/routes/trainingExample2Routes");
const trainingExample3Router = require("./src/routes/trainingExample3Routes");
const trainingExample4Router = require("./src/routes/trainingExample4Routes");
const trainingExample5Router = require("./src/routes/trainingExample5Routes");

app.use("/", loginRouter);
app.use("/", registerRouter);
app.use("/", homeRouter);
app.use("/", choose_homeRouter);
app.use("/", trainingRouter);
app.use("/", training1Router);
app.use("/", leaderboardRouter);
app.use("/", dashboardRouter);
app.use("/", playRouter);
app.use("/", trainingExample1Router);
app.use("/", trainingExample2Router);
app.use("/", trainingExample3Router);
app.use("/", trainingExample4Router);
app.use("/", trainingExample5Router);

app.listen(PORT, () => console.log("server started on port", PORT));