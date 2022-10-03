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
  // console.log("User: ");
  // console.log(req.user);

  // There is weird behavior where sometimes req.user returns an array of length one
  if(Array.isArray(req.user)) {
    req.user = req.user[0]
  }

  let query = " SELECT *, total_num_attempts_tutorial as count, total_score_tutorial as sum FROM captionrater.users where id = " + req.user.id;

  let count = 0;
  let sum = 0;
  // console.log(query);
  await db.execute(query).then((data) => {


    req.user = data[0][0];
    count = req.user.count;
    sum = req.user.sum;

    data = req.user;
    let total = sum;
    let accuracy = req.user.level;

    req.total_score_tutorial = total;
    //  console.log("emaill: "+req.user.total_num_attempts);

    next();
  });
  // console.log(users[3].email);
}

async function getImageidFromCaptions_playresult(req, res, next) {
  let userID = req.user.id;
  let query = "";

  query = " SELECT * from captionrater.tutorialCaptions where cap_id=" + req.body.cap_id;

  await db.query(query).then((captions) => {
    // console.log(captions[0])
    req.caption = captions[0];
    req.consensus = captions[0].consensus;
  })
  next();
}

async function getImagefromImageId(req, res, next) {
  caption = req.caption;
  let query = `SELECT * FROM captionrater.images where img_id =${caption[0].images_img_id}`;

  await db.execute(query).then((image) => {
    req.image = image[0];

    next();
  })
}

async function insertTrainingRatings(req, res, next) {
  var random_good_answer =
    good_guess[Math.floor(Math.random() * good_guess.length)];
  var random_bad_answer =
    bad_guess[Math.floor(Math.random() * bad_guess.length)];
  var random_very_bad_answer =
    very_bad_guess[Math.floor(Math.random() * very_bad_guess.length)];
  let current_success = 0;
  let diff = Math.abs(req.body.inlineRadioOptions - req.caption[0].consensus);
    // console.log(req.body.inlineRadioOptions);
    if (diff === 0) {
      req.score = 3;
      req.gif = "play.gif";
      req.ans = random_good_answer;
    } else if (diff === 1) {
      req.score = 2;
      req.gif = "Actual_Animation_(5).gif";

      req.ans = "So close! Try harder next time!";
    } else if (diff === 2) {
      req.score = 1;
      req.gif = "Actual_Animation_(4).gif";
      req.ans = random_bad_answer;
    } else {
      req.score = 0;
      req.gif = "Actual_Animation_(3).gif";
      req.ans = random_very_bad_answer;
    }
    
    let query =
    "Insert INTO captionrater.trainingRatings (rate, scores, consensus, users_user_id, captions_cap_id, success ) VALUES  ( " +
    req.body.inlineRadioOptions +
    ", " +
    req.score +
    ", " +
    req.caption[0].consensus +
    ", " +
    req.user.id +
    ", " +
    req.body.cap_id +
    ", " +
    current_success +
    " ) ";

    console.log(query);
    await db.execute(query).then((res) => {
      next();
    }).catch();
}



async function selectImage(req, res, next) {
  let query =
    "SELECT * FROM captionrater.tutorialCaptions where ratings = (select MIN(ratings) from tutorialCaptions) order by RAND();";
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
  let query = `UPDATE captionrater.users set tutorial_images = tutorial_images-1, total_score_tutorial = total_score_tutorial + ${req.score}, total_num_attempts_tutorial = total_num_attempts_tutorial + 1 where id = ${req.user.id}`;
  console.log(query);
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
    req.total_score_tutorial = req.user.total_score_tutorial;
    next();
  });
  // console.log(users[3].email);
}

async function calculateScore(req, res, next) {
  
  // console.log(req.query);
  let query = `SELECT * FROM captionrater.tutorialCaptions where cap_id = ${req.query.cap_id}`;

  await db.execute(query).then(async (caption) => {
    // console.log(caption);
    query = `SELECT * FROM captionrater.images where img_id =${caption[0][0].images_img_id}`;
    await db.execute(query).then((image) => {
      req.caption = caption[0][0];
      
      req.image = image[0];
      req.score = req.query.score

      next();
    })
      .catch();
  });
}

router.post("/tutorial_res", 
getUserInfo,
getImageidFromCaptions_playresult,
getImagefromImageId,
insertTrainingRatings,
getUserInfo,
updateCaption,
updateUserScore,
(req, res) => {
  // console.log(req.body)
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
    total_score: req.total_score_tutorial,
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
