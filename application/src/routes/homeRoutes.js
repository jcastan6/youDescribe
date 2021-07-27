const express = require("express");
const passport = require("passport");

const { User } = require("../models/user.js");
const router = express.Router();
// const db = require("../models/database.js");
// const fs = require('fs');
// const content = fs.readFileSync('/Users/rayafarshad/Documents/SFSU/SPRING2020/Independent\ Study/JSON/vsepp_glac_with_rating_5000-6000.json');

router.get("/", function (req, res, next) {
  res.render("home", {
    error_msg: "",
    title: "Login",
    isLoggedIn: req.isAuthenticated(),
  });
});

router.get("/chooseHome", function (req, res, next) {
  res.render("chooseHome", {});
});
router.get("/play_result", function (req, res, next) {
  console.log(req.query);
  let confidence = req.query.confidence;
  let image = req.query.image;
  let caption = req.query.caption;
  let rate = req.query.rate;
  let consensus = req.query.consensus;
  let score = req.query.score;
  let comment = req.query.comment;
  let rating = req.query.rating;
  let disputed = req.query.disputed;
  let gif = req.query.gif;
  let total_score = req.query.total_score;

  res.render("play_result", {
    confidence: confidence,
    total_score: total_score,
    gif: gif,
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

module.exports = router;
