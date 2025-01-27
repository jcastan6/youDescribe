/*
1. At the begining we have caption_id , image_id
2. The user click on submit
3. Now we have new_rate , caption_id , image_id
4. Get the current_consensus from the captions table
5. Calculate the user score based on that
6. Insert score and the consensus(that we calculated the users score base on that) and new_rate , caption_id , image_id into the rating table
7. Insert users total score , total attempt and level to the users table
8. Re calculate the consensus based on the users new_rate and add it to the caption table
// 9. Check if the old_consensus === -1 and new_consensus !== -1 then we want to update the previous score, consensus and success column in ratings table
// 10. Use a query to give use sum of the score , sum of the success for each user in the ratings table
// 11. Loop through the above tale and select the same user id from users table and update the total score, level, total number of success in the users table

*/
const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const url = require("url");
const { totalmem } = require("os");
bucket_num = 1;
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

async function getImageidFromCaptions(req, res, next) {
  let userID = req.user.id;
  let query = "";
  if (req.tutorial) {
    query =
      "SELECT * FROM captionrater.probationCaptions where ratings = (select MIN(ratings) from probationCaptions) order by RAND();";
  } else {
    // query =
    //   "select * from captions where cap_id = (select captions_cap_id from (select captions_cap_id, count(captions_cap_id) as count  from ratings group by captions_cap_id order by count) t1 limit 1)";
    query = "SELECT * FROM captions WHERE total_number_of_rates=(SELECT MIN(total_number_of_rates) FROM captions) ORDER BY RAND();"
  }
  await db.query(query).then((captions) => {
    var captions = captions[0];
    console.log("captions[0].cap_id : " + captions[0].cap_id);

    req.caption_id = captions[0].cap_id;
    req.img_id_from_captions = captions[0].images_img_id;
    req.caption_from_captions = captions[0].caption;
    global_CapId = req.body.hidden_input;
    global_ImgId = req.img_id_from_captions;
    global_caption = req.caption_from_captions;
    next();
  });
}

async function getImageidFromCaptions_playresult(req, res, next) {
  let userID = req.user.id;
  let query = "";
  if (req.tutorial) {
    query =
      " SELECT * from captionrater.probationCaptions where cap_id=" +
      req.body.hidden_input;
  } else {
    query =
      " SELECT * from captionrater.captions where cap_id=" +
      req.body.hidden_input;
    // console.log(userID);
  }
  await db.query(query).then((captions) => {
    // console.log("captions[0].cap_id : "+captions[0].cap_id);
    captions = captions[0];
    req.caption_id = req.body.hidden_input;
    console.log(req.caption_id + "\n\n");
    req.img_id_from_captions = captions[0].images_img_id;
    req.caption_from_captions = captions[0].caption;
    next();
  });
}

async function getImageUrlfromImageId(req, res, next) {
  let imgID = req.img_id_from_captions;
  let query =
    " SELECT img_url as img_url  FROM captionrater.images where img_id =  " +
    imgID;
  console.log("query: " + query);
  await db.query(query).then((imgURL) => {
    req.imgURL = imgURL[0][0].img_url;
    next();
  });
}

async function getUserInfo(req, res, next) {
  let query =
    "SELECT *, total_num_attempts as count, total_score as sum, level FROM captionrater.users where id=" +
    req.user.id;
  let count = 0;
  let sum = 0;

  await db.query(query).then(async (data) => {
    data = data[0];

    count = data[0].count;
    sum = data[0].sum;

    data = data[0];
    let total = sum;
    let accuracy = data.level;
    req.total_score = total;

    console.log("totalscore: " + req.total_score);
    req.users = data;
    req.accuracy = Math.round(accuracy);
    console.log("accuracy: " + req.accuracy);
    console.log(req.users);
    if (req.users.probation_images > 0) {
      console.log("probation");
      req.tutorial = true;
      req.probation_comment =
        "Probation Images Remaining: \n" + req.users.probation_images;
      next();
    } else if (parseInt(req.users.total_score) < 25 && count >= 20) {
      console.log("here! \n \n");
      req.tutorial = true;
      query =
        " UPDATE captionrater.users SET " +
        "probation_images = probation_images + 20, total_score = 0, total_num_attempts = 0" +
        " where id = " +
        req.users.id;
      await db.query(query).then(async (data) => {
        next();
      });
    } else {
      req.tutorial = false;
      next();
    }
  });
  // console.log(users[3].email);
}

async function getCurrentConsensus(req, res, next) {
  if (req.tutorial) {
    let query =
      " SELECT * FROM captionrater.probationCaptions where cap_id = " +
      req.caption_id;

    console.log(query);
    await db.query(query).then((consensus) => {
      consensus = consensus[0];
      req.consensus = consensus[0].consensus;
      next();
    });
  } else {
    let query =
      " SELECT * FROM captionrater.captions where cap_id = " + req.caption_id;

    console.log(query);
    await db.query(query).then((consensus) => {
      consensus = consensus[0];
      req.consensus = consensus[0].consensus;
      next();
    });
  }
}

async function insertRatings(req, res, next) {
  //calculateScore and check the success (if true) -> add one to success column
  if (req.tutorial) {
    console.log("tutorial!! + \n\n");
    let difference = Math.abs(req.body.inlineRadioOptions - req.consensus);
    req.confidence = "High";
    if (difference <= 0) {
      req.current_score = 2;
    } else if (difference <= 1) {
      req.current_score = 1;
    } else if (difference <= 2) {
      req.current_score = 0;
    } else if (difference <= 3) {
      req.current_score = -1;
    } else {
      req.current_score = -2;
    }
    console.log(difference);
    req.disputed = 0;
    let query = `UPDATE probationCaptions SET ratings = ratings +  1 WHERE cap_id = ${req.caption_id}`;
    await db.query(query).then((res) => {
      next();
    });
  } else {
    let query2 = `SELECT ratings.rate, ratings.rate_id, ratings.users_user_id as user_id FROM captionrater.ratings where captions_cap_id = ${req.body.hidden_input} `;
    await db
      .query(query2)
      .then(async (res) => {
        //check how many ai ratings there are
        //if any of them have userid = 1, let's replace them with the new human score
        //otherwise, insert a new column
        res = res[0];
        deleteQuery = "";
        if (res.length === 2) {
          res.forEach((rate) => {
            if (rate.user_id === 1) {
              deleteQuery = `DELETE from captionrater.ratings WHERE rate_id = ${rate.rate_id}`;
            }
          });
        }

        const ratings = [];
        res.forEach((rate) => {
          ratings.push(rate["rate"]);
        });
        console.log(ratings);
        req.past_ratings = ratings;

        let n = ratings.length;
        const average = (arr) => arr.reduce((acc, v) => acc + v) / arr.length;
        const variance = (arr) =>
          arr.reduce((acc, v) => avg + Math.pow(v - avg, 2)) / n;
        let avg = average(ratings);
        let Var = variance(ratings);
        let r = 1 + (1 + ((n - 1) * Var) / 4) / n;
        console.log(`average: ${avg}`);
        console.log(`variance: ${Var}`);
        console.log(`r: ${r}`);

        let current_consensus = req.consensus;
        let current_score = 0;

        let current_rate = parseInt(req.body.inlineRadioOptions);

        let current_success = 0;
        let difference = Math.abs(current_rate - current_consensus);

        if (r < 1.25) {
          req.confidence = "High";
        } else if (1.25 <= r <= 1.66) {
          req.confidence = "Medium";
        } else if (r > 1.66) {
          req.confidence = "Low";
        }

        if (difference <= 0.25 * r) {
          current_score = 2;
        } else if (difference <= 0.50 * r) {
          current_score = 1;
        } else if (difference <= r) {
          current_score = 0;
        } else if (difference <= 1.75 * r) {
          current_score = -1;
        } else {
          current_score = -2;
        }

        let query =
          "Insert INTO captionrater.ratings (rate, scores, consensus, users_user_id, captions_cap_id, success, confidence ) VALUES  ( " +
          parseInt(req.body.inlineRadioOptions) +
          ", " +
          current_score +
          ", " +
          current_consensus +
          ", " +
          req.user.id +
          ", " +
          req.body.hidden_input +
          ", " +
          current_success +
          ", " +
          JSON.stringify(req.confidence) +
          " ) ";
        console.log(query);

        await db
          .query(query)
          .then((res) => {
            res = res[0];
            console.log("\n\n" + res);
            req.current_score = current_score;
            req.rating = res.insertId;
            req.disputed = 0;
            if (deleteQuery !== "") {
              req.replacingAI = true;
              db.query(deleteQuery).then((res) => {
                next();
                console.log("deleted ai");
              });
            } else {
              req.replacingAI = false;
              next();
            }
          })
          .catch();
      })
      .catch();
  }
}

async function getRatingsInfo(req, res, next) {
  let userID = req.user.id;
  let query =
    " SELECT * FROM captionrater.ratings R, captionrater.captions C, captionrater.images I where R.captions_cap_id = C.cap_id AND C.images_img_id = I.img_id AND R.users_user_id = " +
    userID;
  // console.log(query);
  await db.query(query).then((ratings) => {
    // req.current_score = ratings[0].scores;

    req.ratings = ratings[0];

    next();
  });
}

async function updateUsersTable(req, res, next) {
  //increment the userAttempts by one
  let query =
    "SELECT total_num_attempts as attempts, total_score as sum, level FROM captionrater.users where id=" +
    req.user.id;

  console.log("query is: " + query);
  await db.query(query).then(async (user) => {
    user = user[0][0];
    let query2 = "";
    if (req.tutorial === true) {
      req.total_score = parseInt(req.total_score) + parseInt(req.current_score);
      query2 =
        " UPDATE captionrater.users SET " +
        `probation_images = probation_images - 1, total_score =  ${req.total_score}, total_num_attempts = total_num_attempts + 1` +
        " where id = " +
        req.user.id;
    } else {
      //add scores to user's total_score
      let score = req.ratings[req.ratings.length - 1].scores;
      // add total_success to users table
      let success = req.ratings[req.ratings.length - 1].success;
      let sum = parseInt(user.sum);
      let attempts = parseInt(user.attempts);
      console.log("sum: " + sum);
      console.log("score: " + score);
      let level = ((sum + parseInt(score)) / ((attempts + 1) * 3)) * 10;
      req.accuracy = level;

      req.total_score = parseInt(req.total_score) + parseInt(score);
      query2 =
        " UPDATE captionrater.users SET " +
        "total_score = total_score  + " +
        score +
        " , " +
        "level = " +
        level +
        " , " +
        "total_num_attempts = total_num_attempts + 1 " +
        " , " +
        "total_num_success = total_num_success + " +
        success +
        " where id = " +
        req.user.id;
    }

    console.log(query2);
    await db.query(query2).then((user) => {
      next();
    });
  });
}

async function getRatingsAveForCap(req, res, next) {
  if (!req.tutorial) {
    let query =
      "SELECT AVG(rate)  as ave_rate, count(rate) as count_rate FROM captionrater.ratings where captions_cap_id = " +
      req.body.hidden_input;
    console.log("ave " + query);
    await db.query(query).then((ratingForEachCaption) => {
      ratingForEachCaption = ratingForEachCaption[0];
      req.ave_rate = ratingForEachCaption[0].ave_rate;
      req.count_rate = ratingForEachCaption[0].count_rate;
      next();
    });
  } else {
    next();
  }
}

async function updateConsensus(req, res, next) {
  //calculate consensus using previous ratings for that caption id
  // let prev_users_rate = req.ratings[req.ratings.length -2].rate;
  let new_consensus = -1;

  //Scenario 1 : no consensus
  let current_consensus = req.consensus;

  new_consensus = req.ave_rate;
  if (req.tutorial) {
    next();
  } else {
    console.log("new_consensus = " + new_consensus);
    let query = "";
    if (req.replacingAI === true) {
      query =
        " update captionrater.captions SET consensus = " +
        new_consensus +
        ", total_number_of_rates = total_number_of_rates+1 where cap_id = " +
        req.body.hidden_input;
    } else {
      query =
        " update captionrater.captions SET consensus = " +
        new_consensus +
        ", total_number_of_rates = total_number_of_rates+1 where cap_id = " +
        req.body.hidden_input;
    }

    console.log(query);
    await db.query(query).then((res) => {
      req.old_consensus = current_consensus;
      req.new_consensus = new_consensus;
      // req.ratings = ratings;
      next();
    });
  }
}

router.get(
  "/play",
  getUserInfo,
  getImageidFromCaptions,
  getImageUrlfromImageId,
  getCurrentConsensus,

  (req, res) => {
    let caption_from_captions = req.caption_from_captions;
    let imgURL = req.imgURL;
    // let scores = req.scores;
    let total_score = req.total_score;
    console.log(total_score);
    console.log("req.imgURL 1 : " + req.imgURL);
    console.log("req.consensus 1: " + req.consensus);
    console.log("cap id:" + req.caption_id);
    if (req.accuracy === "NaN") {
      req.accuracy = "Pending";
    } else {
      req.accuracy = Math.round(req.accuracy) + "%";
    }

    res.render("play", {
      probation_images: req.users.probation_images,
      caption_from_captions: caption_from_captions,
      imgURL: imgURL,
      probation_comment: req.probation_comment,
      //    scores : scores,
      total_score: total_score,
      accuracy: req.accuracy,
      caption_id: req.caption_id,
    });
  }
);

async function insertDispute(req, res, next) {
  // console.log("params: "+req.body.image);
  if (req.body.dispute_description !== "undefined") {
    console.log(req.body.dispute_description);
    //     let query = `UPDATE captionrater.ratings SET dispute = 1 WHERE rate = ${req.body.rate} AND scores = ${req.body.scores} AND caption = "${req.body.caption}" AND consensus = ${req.body.consensus} AND users_user_id = ${req.user.id} `;
    let query = `UPDATE captionrater.ratings SET dispute = 1, dispute_desc = "${req.body.dispute_description}" where rate_id = "${req.body.hidden_input}"`;
    console.log(query);
    await db.query(query).then((captions) => {
      // console.log(query);
      // req.capID = captions[0].cap_id;
      // console.log(req.capID);

      req.disputed = 1;
      next();
    })
    .catch((err) => {
    	console.log(err);
	next();
    })
  }
}

router.post(
  "/play",
  getUserInfo,
  getImageidFromCaptions_playresult,
  getImageUrlfromImageId,
  getCurrentConsensus,
  insertRatings,
  getRatingsInfo,
  getRatingsAveForCap,
  updateConsensus,
  getUserInfo,
  updateUsersTable,
  insertDispute,
  (req, res) => {
    console.log(req.body);
    var random_good_answer =
      good_guess[Math.floor(Math.random() * good_guess.length)];
    var random_bad_answer =
      bad_guess[Math.floor(Math.random() * bad_guess.length)];
    var random_very_bad_answer =
      very_bad_guess[Math.floor(Math.random() * very_bad_guess.length)];
    var ans;
    let gif2 = "";
    if (req.current_score < 0) {
      gif2 = "./Actual_Animation_(3).gif";
      ans = random_very_bad_answer;
    } else if (req.current_score == 0) {
      gif2 = "./Actual_Animation_(4).gif";
      ans = random_bad_answer;
    } else if (req.current_score == 1) {
      gif2 = "./Actual_Animation_(5).gif";
      ans = "So close! Try harder next time!";
    } else {
      gif2 = "./play.gif";
      ans = random_good_answer;
    }
    // ans = (req.current_score <= 5) ? random_bad_answer : random_good_answer;
    // if(req.consensus == -1){ans = "You will recieve your score later :)"};
    console.log("req.current_score: " + req.current_score);
    console.log("req.imgURL 2: " + req.imgURL);
    console.log("req.consensus 2: " + req.consensus);
    console.log(req.total_score);
    res.redirect(
      url.format({
        pathname: "/play_result",
        query: {
          confidence: req.confidence,
          total_score: req.total_score,
          gif: gif2,
          comment: ans,
          rating: req.rating,
          rate: parseInt(req.body.inlineRadioOptions),
          score: req.current_score,
          consensus: req.consensus,
          image: req.imgURL,
          caption: req.caption_from_captions,
          disputed: req.disputed,
        },
      })
    );
  }
);

router.post("/addDispute", insertDispute, async (req, res) => {
  console.log("dispute added");
  res.redirect('/play');
});

module.exports = router;
