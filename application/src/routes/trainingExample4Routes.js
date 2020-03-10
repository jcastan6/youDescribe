const express = require("express");
const router = express.Router();

router.get("/trainingExample4", function(req, res, next) {
    res.render("trainingExample4", { title: "Express" });
  });



  module.exports = router;