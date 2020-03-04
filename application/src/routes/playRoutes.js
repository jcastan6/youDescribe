const express = require("express");
const router = express.Router();

router.get("/play", function(req, res, next) {
    res.render("play", { title: "Express" });
  });



  module.exports = router;