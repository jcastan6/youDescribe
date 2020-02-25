const express = require("express");
const db = require("../models/database.js").default;
const router = express.Router();
const passport = require("passport");
var expressValidator = require("express-validator");


  // Gets registration page
router.get("/register", function(req, res, next) {
  // console.log("11 : " + req.body);
  res.render("register", {
    title: "Form Validation",
  });
  
});
  // Gets registration page
  router.post("/register", function(req, res, next) {
    // console.log(req.body.name);
    console.log(req.body);
    // console.log(req.body.password);
    
    res.render("register", {
      title: "Form Validation2",
    });
    
  //   // req.session.errors = null;
  });






  module.exports = router;