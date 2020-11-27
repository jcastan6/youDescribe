const express = require("express");
const router = express.Router();
const db = require("../models/database.js");

async function sortByTotalScore(req, res, next) {
  // rate = req.body.inlineRadioOptions;
  let query =
    "SELECT * FROM db.users  where id not in (21,22) order by total_score desc LIMIT 50;";
  console.log(query);
  await db.execute(query, (err, sortByTotalScore) => {
    console.log(err);
    if (err) throw err;
    req.sortByTotalScore = sortByTotalScore;

    next();
  });
}
async function sortByAccuracy(req, res, next) {
  // rate = req.body.inlineRadioOptions;
  let query =
    "SELECT * FROM db.users  where id not in (21,22) order by level desc LIMIT 50;";
  console.log(query);
  await db.execute(query, (err, sortByAccuracy) => {
    if (err) throw err;
    req.sortByAccuracy = sortByAccuracy;

    next();
  });
}
async function sortByScoreAccuracy(req, res, next) {
  // rate = req.body.inlineRadioOptions;
  let query =
    "SELECT *, (total_score*level)/100 as result  FROM db.users  where id not in (21,22) order by result desc LIMIT 50;";
  console.log(query);
  await db.execute(query, (err, sortByScoreAccuracy) => {
    if (err) throw err;
    req.sortByScoreAccuracy = sortByScoreAccuracy;

    next();
  });
}

router.get(
  "/leaderboard",
  sortByTotalScore,
  sortByAccuracy,
  sortByScoreAccuracy,
  function(req, res, next) {
    let sort_TotalScore = req.sortByTotalScore;
    let sort_ByAccuracy = req.sortByAccuracy;
    let sort_ByScoreAccuracy = req.sortByScoreAccuracy;

    res.render("leaderboard", {
      sort_TotalScore: sort_TotalScore,
      sort_ByAccuracy: sort_ByAccuracy,
      sort_ByScoreAccuracy: sort_ByScoreAccuracy
    });
  }
);

module.exports = router;
