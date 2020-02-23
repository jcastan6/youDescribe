const express = require("express");
const router = express.Router();

router.get("/training", function(req, res, next) {
    res.render("training", { title: "Express" });
  });



  module.exports = router;