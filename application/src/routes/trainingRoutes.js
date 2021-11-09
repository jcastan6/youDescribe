const express = require("express");
const router = express.Router();
var http = require("http");
const Sequelize = require("sequelize");
const url = require("url");
const db = require("../models/database.js");
const models = require("../sequelize-models");
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
  let image = req.user.tutorial_images;
  if (image === 0) {
    image = 1;
  }
  let query = `SELECT * FROM captionrater.tutorialCaptions where cap_id = ${image}`;
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

router.get("/tutorial", updateUser, checkFail, selectImage, (req, res) => {
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

async function checkFail(req, res, next) {
  let user = await models.user.findOne({
    where: { id: req.user.id },
  });
  if (user.tutorial_images === 0 && user.total_num_success < 4) {
    user.tutorial_images = 10;
    user.total_num_success = 0;
    await user.save();
    res.redirect("/tutorial_repeat");
  }
  next();
}

async function updateUserScore(req, res, next) {
  console.log(req.success);
  let user = await models.user.findOne({
    where: { id: req.user.id },
  });

  user.tutorial_images = user.tutorial_images - 1;

  if (req.success === true) {
    user.total_num_success = user.total_num_success + 1;
  }

  await user.save();
  next();
}
async function updateUser(req, res, next) {
  let query = `select * from captionrater.users where id = ${req.user.id}`;
  // console.log(query);
  await db.execute(query).then(async (user) => {
    req.user = user[0][0];
  });

  next();
}

async function calculateScore(req, res, next) {
  let query = `SELECT * FROM captionrater.tutorialCaptions where cap_id = ${req.query.cap_id}`;

  await db.execute(query).then(async (caption) => {
    req.caption = caption[0][0];
    query = `SELECT * FROM captionrater.images where img_id =${caption[0][0].images_img_id}`;
    let consensus = caption[0][0].consensus;
    console.log(consensus + "\n\n");
    req.success = true;

    if (consensus !== parseInt(req.query.rate)) {
      req.success = false;
    }
    await db.execute(query).then((image) => {
      req.gif = "https://caption.click/gifs/play.gif";
      req.image = image[0];
      console.log(req.image[0]);
      next();
    });
  });
}

router.post("/tutorial_res", updateCaption, (req, res) => {
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

router.get(
  "/tutorial_res",
  calculateScore,
  updateUserScore,
  updateUser,
  (req, res) => {
    res.render("tutorial_res", {
      score: req.score,
      caption: req.caption,
      image: req.image[0],
      rate: req.query.rate,
      gif: req.gif,
      comment: req.ans,
    });
  }
);

router.get("/tutorial_complete", (req, res) => {
  res.render("tutorial_complete");
});

router.get("/tutorial_repeat", (req, res) => {
  res.render("tutorial_repeat");
});
module.exports = router;
