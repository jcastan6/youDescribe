const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
var good_guess = [
  "Awesome!",
  "Great Job!",
  "Bullseye!",
  "Nailed it!",
  "Excellent!",
  "I knew you had it in you!",
  "Well done, you!",
  "Keep it up, champ!",
  "Slam dunk!",
  "Success!",
  "You GOT this!",
  "Alriiiight!",
];

var notBad_guess = ["So close! Try harder next time!"];
var bad_guess = ["Close!", "Try harder", "Almost!"];
var very_bad_guess = [
  "Sorry!",
  "Really?!",
  "Sad story!",
  "fail!",
  "For realz?!",
  "Lol u wish!",
  "Meh!",
  "Better luck next time!",
  "You got it...NOT!",
  "Scratching my head!",
  "Whomp whomp!",
];

////////first///////////////////first///////////////////first///////////
router.get("/tutorial", (req, res) => {
  console.log(req.params);

  res.render("training", {
    image: 0,
  });
});
router.get("/tutorial/:image", (req, res) => {
  console.log(req.params);
  if (req.params.image === 11) {
    //user has completed tutorial, send to dashboard
  } else {
    res.render("trainingexample1", {
      image: 1,
    });
  }
});

async function calculateScore1(req, res, next) {
  let current_consensus = 4;
  let current_score = req.query.inlineRadioOptions;

  let difference = Math.abs(current_consensus - current_score);
  console.log("diff: " + difference);
  if (current_consensus === -1) {
    current_score = 0;
  } else {
    if (difference <= 0.1) {
      current_score = 20;
    } else if (0.1 < difference && difference <= 0.5) {
      current_score = 10;
    } else if (0.5 < difference && difference <= 1) {
      current_score = 5;
    } else {
      current_score = 0;
    }
  }
  console.log(current_score);
  req.score = current_score;
  next();
}

router.get("/trainingres", calculateScore1, (req, res) => {
  // console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
  var random_good_answer =
    good_guess[Math.floor(Math.random() * good_guess.length)];
  var random_bad_answer =
    bad_guess[Math.floor(Math.random() * bad_guess.length)];
  var random_very_bad_answer =
    very_bad_guess[Math.floor(Math.random() * very_bad_guess.length)];
  var ans;
  if (req.score < 5) {
    ans = random_very_bad_answer;
  } else if (req.score == 10) {
    ans = "So close! Try harder next time!";
  } else if (req.score == 5) {
    ans = random_bad_answer;
  } else {
    ans = random_good_answer;
  }
  console.log(req.query.inlineRadioOptions);
  console.log(req.score);
  let rate = req.query.inlineRadioOptions;
  let score = req.score;

  res.render("trainingres", {
    image: 1,
    rate: rate,
    score: score,
    ans: ans,
  });
});

module.exports = router;
