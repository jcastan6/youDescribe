const express = require("express");
const router = express.Router();
// const db = require("../models/database.js");
// const fs = require('fs');
// const content = fs.readFileSync('/Users/rayafarshad/Documents/SFSU/SPRING2020/Independent\ Study/JSON/vsepp_glac_with_rating_5000-6000.json');

router.get("/", function (req, res, next) {
  res.render("home", {});
});

router.get("/chooseHome", function (req, res, next) {
  res.render("chooseHome", {});
});
router.get("/play_result", function (req, res, next) {
  console.log(req.query);
  let image = req.query.image;
  let caption = req.query.caption;
  let rate = req.query.rate;
  let consensus = req.query.consensus;
  let score = req.query.score;
  let comment = req.query.comment;
  let rating = req.query.rating;
  let disputed = req.query.disputed;

  res.render("play_result", {
    image: image,
    caption: caption,
    rate: rate,
    consensus: consensus,
    score: score,
    comment: comment,
    rating: rating,
    disputed: disputed,
  });
});

router.get("/training", function (req, res, next) {
  res.render("training", {});
});

router.get("/trainingExample1", function (req, res, next) {
  res.render("trainingExample1", {});
});

// router.get("/trainingExample2res", function(req, res, next) {
//   res.render("trainingExample2res", {

//   });

// });
router.get("/trainingExample3", function (req, res, next) {
  res.render("trainingExample3", {});
});

module.exports = router;
