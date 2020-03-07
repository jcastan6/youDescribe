const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
    res.render("home", {

    });
  });


  router.get("/chooseHome", function(req, res, next) {
    console.log("11 : " + req.isAuthenticated());
    console.log("user login11: " + req.user.user_id);
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