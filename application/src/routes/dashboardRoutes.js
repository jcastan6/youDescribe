const express = require("express");
const router = express.Router();

router.get("/dashboard", function(req, res, next) {
    res.render("dashboard", { title: "Express" });
  });



  module.exports = router;