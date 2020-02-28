const express = require("express");
const router = express.Router();

router.get("/chooseHome", function(req, res, next) {
    res.render("chooseHome", {

    });
  });


  

  module.exports = router;