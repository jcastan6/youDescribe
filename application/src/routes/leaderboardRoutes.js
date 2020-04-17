
const express = require("express");
const router = express.Router();
const db = require("../models/database.js");


async function sortByTotalScore(req,res,next){
    // rate = req.body.inlineRadioOptions;
    let query = " SELECT * FROM db.users  where id not in (21,22) order by total_score desc LIMIT 5 ";
    console.log(query);
    await db.execute(query, (err, sortByTotalScore) => {
        if(err) throw err;
        req.sortByTotalScore = sortByTotalScore;

        next();
    });
}
async function sortByTotalScore(req,res,next){
    // rate = req.body.inlineRadioOptions;
    let query = " SELECT * FROM db.users  where id not in (21,22) order by total_score desc LIMIT 5 ";
    console.log(query);
    await db.execute(query, (err, sortByTotalScore) => {
        if(err) throw err;
        req.sortByTotalScore = sortByTotalScore;

        next();
    });
}

  router.get("/leaderboard", sortByTotalScore, function(req, res, next) {

    let sort_TotalScore = req.sortByTotalScore;

    res.render("leaderboard", {
        sort_TotalScore : sort_TotalScore,

    });
  });


  module.exports = router;