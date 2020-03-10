const express = require("express");
const router = express.Router();

router.get("/trainingExample3", function(req, res, next) {
    res.render("trainingExample3", { title: "Express" });
  });



  module.exports = router;