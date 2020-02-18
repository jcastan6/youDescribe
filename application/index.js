const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

//routes path
const loginRouter = require("./src/routes/loginRoutes");

app.use("/", loginRouter);

app.listen(PORT, () => console.log("server started on port", PORT));