const express = require("express");
const router = express.Router();
var http = require("http");
const url = require("url");
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

async function getUserInfo(req, res, next) {
  let query = " SELECT * FROM captionrater.users where id = " + req.user.id;
  // console.log(query);
  await db.execute(query).then((users) => {
    req.user = users[0];
    //  console.log("emaill: "+users[0].total_num_attempts);

    req.accuracy = users[0][0].level;

    next();
  });
  // console.log(users[3].email);
}
async function selectImage(req, res, next) {
  let query = `SELECT * FROM captionrater.tutorialCaptions where cap_id = ${
    req.user.tutorial_images + 1
  }`;
  // console.log(query);
  await db.execute(query).then(async (caption) => {
    req.caption = caption[0][0];
    let query = `SELECT * FROM captionrater.images where img_id =${req.caption.images_img_id}`;
    await db.execute(query).then((image) => {
      req.image = image[0];
    });
    next();
  });
  // console.log(users[3].email);
}

////////first///////////////////first///////////////////first///////////
router.get("/completed", getUserInfo, (req, res) => {
  res.render("completed", {});
});
router.get("/tutorial-intro", getUserInfo, (req, res) => {
  console.log(req.users);

  res.render("tutorial-intro", {
    image: 0,
    users: req.users,
  });
});
router.get("/tutorial", updateUser, selectImage, (req, res) => {
  if (req.user.tutorial_images <= 0) {
    res.redirect("/tutorial_complete");
  } else {
    res.render("tutorial", {
      user: req.user,
      caption: req.caption,
      image: req.image[0],
    });
  }
});
async function updateCaption(req, res, next) {
  let query = `UPDATE captionrater.tutorialCaptions set ratings = ratings+1 where cap_id = ${req.body.cap_id}`;
  // console.log(query);
  await db.execute(query).then(async (caption) => {
    next();
  });
  // console.log(users[3].email);
}

async function updateUserScore(req, res, next) {
  let query = `UPDATE captionrater.users set tutorial_images = tutorial_images-1 where id = ${req.user.id}`;
  // console.log(query);
  await db.execute(query).then(async (caption) => {
    next();
  });
  // console.log(users[3].email);
}
async function updateUser(req, res, next) {
  let query = `select * from captionrater.users where id = ${req.user.id}`;
  // console.log(query);
  await db.execute(query).then(async (user) => {
    req.user = user[0][0];
    next();
  });
  // console.log(users[3].email);
}

async function calculateScore(req, res, next) {
  var random_good_answer =
    good_guess[Math.floor(Math.random() * good_guess.length)];
  var random_bad_answer =
    bad_guess[Math.floor(Math.random() * bad_guess.length)];
  var random_very_bad_answer =
    very_bad_guess[Math.floor(Math.random() * very_bad_guess.length)];

  console.log(req.query);
  let query = `SELECT * FROM captionrater.tutorialCaptions where cap_id = ${req.query.cap_id}`;

  await db.execute(query).then(async (caption) => {
    query = `SELECT * FROM captionrater.images where img_id =${caption[0][0].images_img_id}`;
    await db.execute(query).then((image) => {
      req.caption = caption[0][0];
      let diff = Math.abs(req.query.rate - req.caption.consensus);
      console.log(req.query.rate);
      if (diff === 0) {
        req.score = 3;
        req.gif = "https://caption.click/gifs/play.gif";

        req.ans = random_good_answer;
      } else if (diff === 1) {
        req.score = 2;
        req.gif = "https://caption.click/gifs/Actual_Animation_(5).gif";

        req.ans = "So close! Try harder next time!";
      } else if (diff === 2) {
        req.score = 1;
        req.gif = "https://caption.click/gifs/Actual_Animation_(4).gif";
        req.ans = random_bad_answer;
      } else {
        req.score = 0;
        req.gif = "https://caption.click/gifs/Actual_Animation_(3).gif";
        req.ans = random_very_bad_answer;
      }
      req.image = image[0];
      console.log(req.image[0]);
      next();
    });
  });
}

router.post("/tutorial_res", updateCaption, updateUserScore, (req, res) => {
  res.redirect(
    url.format({
      pathname: "tutorial_res",
      query: {
        cap_id: req.body.cap_id,
        rate: req.body.inlineRadioOptions,
        score: req.score,
      },
    })
  );
});

router.get("/tutorial_res", calculateScore, updateUser, (req, res) => {
  res.render("tutorial_res", {
    score: req.score,
    caption: req.caption,
    image: req.image[0],
    rate: req.query.rate,
    gif: req.gif,
    comment: req.ans,
  });
});

router.get("/tutorial_complete", (req, res) => {
  res.render("tutorial_complete");
});
module.exports = router;
