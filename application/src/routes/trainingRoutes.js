

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
var bad_guess = [
  // "Aw too bad!",
  "Meh!",
  "Better luck next time!",
  // "Sorry!",
  "You got it...NOT!",
  "Really?!",
  // "Sad story!",
  "Scratching my head!",
  // "For realz?!",
  // "Lol u wish!",
  "Whomp whomp!",
];
////////first///////////////////first///////////////////first///////////

router.get("/trainingExample1/", (req, res) => {
  console.log("the rate is :");
  console.log(req.query);
  res.render("trainingExample1", {

  });

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

router.get("/service1/trainingExample1res", calculateScore1, (req, res) => {
  // console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
  var random_good_answer = good_guess[Math.floor(Math.random() * good_guess.length)];
  var random_bad_answer = bad_guess[Math.floor(Math.random() * bad_guess.length)];
  var ans;
  if (req.score <= 5) {
    ans = random_bad_answer;
  } else if (req.score == 10) {
    ans = "So close! Try harder next time!";
  } else {
    ans = random_good_answer;
  }
  console.log(req.query.inlineRadioOptions);
  console.log(req.score);
  let rate = req.query.inlineRadioOptions;
  let score = req.score;

  res.render("trainingExample1res", {
    rate: rate,
    score: score,
    ans: ans

  });

});


////////second///////////////////second///////////////////second///////////

router.get("/trainingExample2", (req, res) => {
  // rate = parseInt(req.body.inlineRadioOptions);
  console.log("the rate is :");
  console.log(req.query);
  res.render("trainingExample2", {

  });

});

async function calculateScore2(req, res, next) {

  //calculateScore and check the success (if true) -> add one to success column
  let current_consensus = 2;
  let current_score = req.query.inlineRadioOptions;

  let difference = Math.abs(current_consensus - current_score);
  console.log("diff2" + difference);
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

router.get("/trainingExample2res", calculateScore2, (req, res) => {
  // console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
  var random_good_answer = good_guess[Math.floor(Math.random() * good_guess.length)];
  var random_bad_answer = bad_guess[Math.floor(Math.random() * bad_guess.length)];
  var ans;
  if (req.score <= 5) {
    ans = random_bad_answer;
  } else if (req.score == 10) {
    ans = "So close! Try harder next time!";
  } else {
    ans = random_good_answer;
  }
  console.log(req.query.inlineRadioOptions);
  console.log(req.score);
  let rate = req.query.inlineRadioOptions;
  let score = req.score;

  res.render("trainingExample2res", {
    rate: rate,
    score: score,
    ans : ans

  });

});




////////third///////////////////third///////////////////third///////////

router.get("/trainingExample3", (req, res) => {
  // rate = parseInt(req.body.inlineRadioOptions);
  console.log("the rate is :");
  console.log(req.query);
  res.render("trainingExample3", {

  });

});

async function calculateScore3(req, res, next) {

  //calculateScore and check the success (if true) -> add one to success column
  
  let current_consensus = 5;
  let current_score = req.query.inlineRadioOptions;

  let difference = Math.abs(current_consensus - current_score);
  console.log("diff2" + difference);
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

router.get("/trainingExample3res", calculateScore3, (req, res) => {
  // console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
  var random_good_answer = good_guess[Math.floor(Math.random() * good_guess.length)];
  var random_bad_answer = bad_guess[Math.floor(Math.random() * bad_guess.length)];
  var ans;
  if (req.score <= 5) {
    ans = random_bad_answer;
  } else if (req.score == 10) {
    ans = "So close! Try harder next time!";
  } else {
    ans = random_good_answer;
  }
  console.log(req.query.inlineRadioOptions);
  console.log(req.score);
  let rate = req.query.inlineRadioOptions;
  let score = req.score;

  res.render("trainingExample3res", {
    rate: rate,
    score: score,
    ans : ans

  });

});



////////forth///////////////////forth///////////////////forth///////////

router.get("/trainingExample4", (req, res) => {
  // rate = parseInt(req.body.inlineRadioOptions);
  console.log("the rate is :");
  console.log(req.query);
  res.render("trainingExample4", {

  });

});

async function calculateScore4(req, res, next) {

  //calculateScore and check the success (if true) -> add one to success column
  let current_consensus = 4;
  let current_score = req.query.inlineRadioOptions;

  let difference = Math.abs(current_consensus - current_score);
  console.log("diff2" + difference);
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

router.get("/trainingExample4res", calculateScore4, (req, res) => {
  // console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
  var random_good_answer = good_guess[Math.floor(Math.random() * good_guess.length)];
  var random_bad_answer = bad_guess[Math.floor(Math.random() * bad_guess.length)];
  var ans;
  if (req.score <= 5) {
    ans = random_bad_answer;
  } else if (req.score == 10) {
    ans = "So close! Try harder next time!";
  } else {
    ans = random_good_answer;
  }
  console.log(req.query.inlineRadioOptions);
  console.log(req.score);
  let rate = req.query.inlineRadioOptions;
  let score = req.score;

  res.render("trainingExample4res", {
    rate: rate,
    score: score,
    ans : ans

  });

});


////////fifth///////////////////fifth///////////////////fifth///////////

router.get("/trainingExample5", (req, res) => {
  // rate = parseInt(req.body.inlineRadioOptions);
  console.log("the rate is :");
  console.log(req.query);
  res.render("trainingExample5", {

  });

});

async function calculateScore5(req, res, next) {

  //calculateScore and check the success (if true) -> add one to success column
  let current_consensus = 1;
  let current_score = req.query.inlineRadioOptions;

  let difference = Math.abs(current_consensus - current_score);
  console.log("diff2" + difference);
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

router.get("/trainingExample5res", calculateScore5, (req, res) => {
  // console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
  var random_good_answer = good_guess[Math.floor(Math.random() * good_guess.length)];
  var random_bad_answer = bad_guess[Math.floor(Math.random() * bad_guess.length)];
  var ans;
  if (req.score <= 5) {
    ans = random_bad_answer;
  } else if (req.score == 10) {
    ans = "So close! Try harder next time!";
  } else {
    ans = random_good_answer;
  }
  console.log(req.query.inlineRadioOptions);
  console.log(req.score);
  let rate = req.query.inlineRadioOptions;
  let score = req.score;

  res.render("trainingExample5res", {
    rate: rate,
    score: score,
    ans : ans

  });

});


module.exports = router;
