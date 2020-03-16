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



  router.get("/training", function(req, res, next) {
    res.render("training", {

    });

    
  });


  router.get("/trainingExample1", function(req, res, next) {
    res.render("trainingExample1", {

    });
    
  });

  router.get("/trainingExample2", function(req, res, next) {
    res.render("trainingExample2", {

    });

  });
  router.get("/trainingExample3", function(req, res, next) {
    res.render("trainingExample3", {

    });

  });



  
  router.get("/leaderboard", function(req, res, next) {
    res.render("leaderboard", {

    });
  });
  

  module.exports = router;