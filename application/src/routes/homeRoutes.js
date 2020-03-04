const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
    res.render("home", {

    });
  });


  router.get("/chooseHome", function(req, res, next) {
    res.render("chooseHome", {

    });
  });

  router.get("/play", function(req, res, next) {
    res.render("play", {

    });
  });

  router.get("/training", function(req, res, next) {
    res.render("training", {

    });

    
  });


  router.get("/training1", function(req, res, next) {
    res.render("training1", {

    });

    
  });

  router.get("/dashboard", function(req, res, next) {
    res.render("dashboard", {

    });
  });

  
  router.get("/leaderboard", function(req, res, next) {
    res.render("leaderboard", {

    });
  });
  

  module.exports = router;