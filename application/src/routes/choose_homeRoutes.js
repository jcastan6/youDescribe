const express = require("express");
const router = express.Router();

router.get("/choose_home", function(req, res, next) {
    res.render("choose_home", { title: "Express" });
  });



  module.exports = router;