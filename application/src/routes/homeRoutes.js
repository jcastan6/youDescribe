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
  router.get("/play_result", function(req, res, next) {
    console.log(req.query);
    let image = req.query.image;
    let caption = req.query.caption;
    let rate = req.query.rate;
    let consensus = req.query.consensus;
    let score = req.query.score;
    let comment = req.query.comment;
    
    res.render("play_result", {
      image : image,
      caption : caption,
      rate : rate,
      consensus : consensus,
      score : score,
      comment : comment

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

  // router.get("/trainingExample2res", function(req, res, next) {
  //   res.render("trainingExample2res", {

  //   });

  // });
  router.get("/trainingExample3", function(req, res, next) {
    res.render("trainingExample3", {

    });

  });



  
  router.get("/leaderboard", function(req, res, next) {
    res.render("leaderboard", {

    });
  });
  

  module.exports = router;