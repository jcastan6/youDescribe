const express = require("express");
const router = express.Router();

router.get("/trainingExample2", function(req, res, next) {
    res.render("trainingExample2", { title: "Express" });
  });



  module.exports = router;