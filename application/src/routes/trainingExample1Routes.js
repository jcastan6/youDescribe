const express = require("express");
const router = express.Router();

router.get("/trainingExample1", function(req, res, next) {
    res.render("trainingExample1", { title: "Express" });
  });



  module.exports = router;