const express = require("express");
const router = express.Router();

router.get("/training1", function(req, res, next) {
    res.render("training1", { title: "Express" });
  });



  module.exports = router;