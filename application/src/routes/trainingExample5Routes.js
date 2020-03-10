const express = require("express");
const router = express.Router();

router.get("/trainingExample5", function(req, res, next) {
    res.render("trainingExample5", { title: "Express" });
  });



  module.exports = router;