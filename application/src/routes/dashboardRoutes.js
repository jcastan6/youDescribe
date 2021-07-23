const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const url = require("url");

async function getUserInfoFromRatings(req, res, next) {
  let userID = req.user.id;
  let query =
    " SELECT R.rate_id, R.rate, R.scores, R.consensus as consensus, R.users_user_id, R.captions_cap_id, R.success, R.dispute, R.createdAt, C.cap_id, C.caption, C.images_img_id, C.dataset_name, I.img_id, I.img_name, I.img_url, R.confidence FROM captionrater.ratings R, captionrater.captions C, captionrater.images I where R.captions_cap_id = C.cap_id AND C.images_img_id = I.img_id AND R.users_user_id =" +
    userID +
    " order by R.rate_id DESC LIMIT 100";
  // console.log("the query is: "+query);

  await db.execute(query).then((ratings) => {
    req.ratings = ratings[0];
    console.log(ratings[0]);
    next();
  });

  // console.log(ratings[0].consensus[0])
}

async function getUserInfo(req, res, next) {
  let query = " SELECT * FROM captionrater.users where id = " + req.user.id;
  // console.log(query);
  await db.execute(query).then((users) => {
    req.users = users[0];
    //  console.log("emaill: "+users[0].total_num_attempts);

    req.accuracy = users[0][0].level;

    next();
  });
  // console.log(users[3].email);
}

async function insertDispute(req, res, next) {
  // console.log("params: "+req.body.image);
  if (req.body.dispute_description !== "undefined") {
    console.log(req.body.dispute_description);
    //     let query = `UPDATE captionrater.ratings SET dispute = 1 WHERE rate = ${req.body.rate} AND scores = ${req.body.scores} AND caption = "${req.body.caption}" AND consensus = ${req.body.consensus} AND users_user_id = ${req.user.id} `;
    let query = `UPDATE captionrater.ratings SET dispute = 1, dispute_desc = "${req.body.dispute_description}" where rate_id = "${req.body.hidden_input}"`;
    console.log(query);
    await db.execute(query).then((captions) => {
      // console.log(query);
      // req.capID = captions[0].cap_id;
      // console.log(req.capID);

      next();
    });
  }
}

//not used?
async function dispute(req, res, next) {
  //console.log("params: "+req.body);

  if (req.body.submit === "Dispute") {
    // console.log("this is me2");
    let query = `UPDATE captionrater.ratings SET dispute = 1 WHERE rate = ${req.body.rate} AND scores = ${req.body.scores} AND captions_cap_id = ${req.capID} AND consensus = ${req.body.consensus} AND users_user_id = ${req.user.id} `;
    // console.log(query);
    await db.execute(query).then((captions) => {
      next();
    });
  } else {
    next();
  }
}

//findCaption, dispute,
router.post(
  "/dashboard",
  getUserInfoFromRatings,
  getUserInfo,
  insertDispute,
  function (req, res, next) {
    // console.log("params: "+req.data);
    console.log("body: ", req.body.hidden_input);
    console.log("body: ", req.body.dispute_description);
    let ratings = req.ratings;
    let users = req.users;
    let accuracy = req.accuracy;
    // console.log("ratingsPost : "+ratings[2][3]);
    // console.log(req.ratings[req.ratings.length - 1].caption);

    // console.log(ratings[0].caption);
    // var accuracy = 0;
    res.render("dashboard", {
      ratings: ratings,
      users: users,
      accuracy: accuracy.toFixed(2),
    });
  }
);

router.get(
  "/dashboard",
  getUserInfoFromRatings,
  getUserInfo,
  function (req, res, next) {
    let ratings = req.ratings;
    let users = req.users;
    let accuracy = req.accuracy;
    // console.log("ratingsGet : "+ratings[2].consensus);
    // console.log(req.ratings[req.ratings.length - 1].caption);
    // console.log("users: "+users);
    // console.log("accuracy : "+accuracy.toFixed(2));
    // console.log(ratings[0].caption);
    res.render("dashboard", {
      ratings: ratings,
      users: users,
      accuracy: accuracy,
    });
  }
);

module.exports = router;
