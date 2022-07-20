const express = require("express");
const router = express.Router();
const db = require("../models/database.js");

async function sortByTotalScore(req, res, next) {
  // rate = req.body.inlineRadioOptions;
  let query =
    "SELECT * FROM captionrater.users  where id not in (1) order by total_score desc LIMIT 5";
  console.log(query);
  const result = await db.query(query);
  console.log(result);
  req.sortByTotalScore = result[0];
  next();
}

async function sortByDailyScore(req, res, next) {
  // rate = req.body.inlineRadioOptions;
  //selects user with highest points in last 24 hours
  let query =
    "SELECT user.username, sum(scores) as result FROM ratings INNER JOIN users user ON users_user_id = user.id  WHERE ratings.createdAt > DATE_SUB(CURDATE(), INTERVAL 2 DAY) GROUP by users_user_id order by result DESC LIMIT 3;";
  console.log(query);
  const result = await db.query(query);
  console.log(result);
  req.sortByDailyScore = result[0];
  next();
}

router.get(
  "/leaderboard",
  sortByTotalScore,

  sortByDailyScore,
  function (req, res, next) {
    let sort_TotalScore = req.sortByTotalScore;
    let sort_ByDailyScore = req.sortByDailyScore;

    res.render("leaderboard", {
      sort_TotalScore: sort_TotalScore,
      sort_ByDailyScore: sort_ByDailyScore,
    });
  }
);

module.exports = router;
