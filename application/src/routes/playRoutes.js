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

let global_CapId;
let global_ImgId;
let global_caption;
async function checkIfDataExists(req, res, next) {
  //   let userID = req.user.id;
  //   let query = " select * from captionrater.captions ";
  //   await db.query(query, (err, res) => {
  //     console.log(query);
  //     if (err) throw err;
  //     if (res[0] === undefined) {
  //       bucket_num++;
  //       checkIfDataExists(req, res, next);
  //     } else {
  //       next();
  //     }
  //   });
  next();
}

async function getImageidFromCaptions(req, res, next) {
  let userID = req.user.id;

  let query = "SELECT * from captionrater.captions ORDER BY RAND() LIMIT 5 ;";

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
  let query =
    " SELECT * from captionrater.captions where cap_id=" +
    req.body.hidden_input;
  // console.log(userID);

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

// async function getUserInfo(req, res, next) {
//   // rate = req.body.inlineRadioOptions;
//   let query = " SELECT * FROM db.users where id = " + req.user.id;
//   // console.log(query);
//   await db.query(query, (err, users) => {
//     if (err) throw err;
//     req.total_score = users[0].total_score;
//     req.total_num_attempts = users[0].total_num_attempts;
//     req.total_num_success = users[0].total_num_success;
//     var accuracy = 0;
//     var accuracy_divisor = users[0].total_num_attempts * 20;
//     var accuracy_divident = users[0].total_score;
//     if (accuracy_divisor !== 0) {
//       accuracy = (accuracy_divident / accuracy_divisor) * 100;
//     }
//     req.accuracy = accuracy;
//     next();
//   });
// }

async function getUserInfo(req, res, next) {
  //rating system changed, new scoring system puts 5 as maximum score. Accuracy is now calculated off of scores that were made before and after the change.
  // rate = req.body.inlineRadioOptions;

  //20 point system

  console.log("userid: " + req.user.id);
  let query1 =
    "SELECT count(*) as count, sum(scores) as sum FROM captionrater.ratings where users_user_id=" +
    req.user.id +
    " and createdAt < '2020-06-18'";
  let count1 = 0;
  let sum1 = 0;

  //5 point system
  let query2 =
    "SELECT count(*) as count, sum(scores) as sum FROM captionrater.ratings where users_user_id=" +
    req.user.id +
    " and createdAt >= '2020-06-18'";
  let count2 = 0;
  let sum2 = 0;

  await db.query(query1).then(async (data) => {
    data = data[0];

    if (sum1 === null) {
      sum1 = 0;
    }
    count1 = data[0].count;
    sum1 = data[0].sum;

    await db.query(query2).then((data) => {
      data = data[0];
      count2 = data[0].count;
      sum2 = data[0].sum;

      if (sum2 === null) {
        sum2 = 0;
      }

      req.total_score = sum1 + sum2;
      console.log("totalscore: " + req.total_score);
      let total = count1 + count2;
      let accuracy1 = (sum1 * 100) / (20 * total);
      let accuracy2 = (sum2 * 100) / (5 * total);
      console.log("accuracy 1: " + accuracy1);
      console.log("accuracy 2: " + accuracy2);
      req.accuracy = accuracy1 + accuracy2;
      console.log("accuracy: " + req.accuracy);

      next();
    });
  });
}

async function getCurrentConsensus(req, res, next) {
  // rate = req.body.inlineRadioOptions;

  let query =
    " SELECT * FROM captionrater.captions where cap_id = " + req.caption_id;

  console.log(query);
  await db.query(query).then((consensus) => {
    consensus = consensus[0];
    req.consensus = consensus[0].consensus;
    next();
  });
}

async function insertRatings(req, res, next) {
  //calculateScore and check the success (if true) -> add one to success column
  let current_consensus = req.consensus;
  let current_score = 0;
  // console.log("success1 ");
  let current_rate = parseInt(req.body.inlineRadioOptions);
  // console.log("scores1 "+req.query.inlineRadioOptions);
  let current_success = 0;
  let difference = Math.abs(current_consensus - current_rate);
  console.log(current_rate);
  console.log(current_consensus + "\n\n");
  if (current_consensus === -1) {
    current_score = 0;
  } else {
    if (difference <= 0.5) {
      current_score = 5;
      current_success = 1;
    } else if (0.5 < difference && difference <= 1.25) {
      current_score = 3;
      current_success = 1;
    } else if (1.25 < difference && difference <= 2) {
      current_score = 1;
      current_success = 1;
    } else {
      current_score = 0;
      current_success = 0;
    }
    // req.query.inlineRadioOptions
    // parseInt(req.body.inlineRadioOptions)
  }

  let query =
    "Insert INTO captionrater.ratings (rate, scores, consensus, users_user_id, captions_cap_id, success ) VALUES  ( " +
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
      next();
    })
    .catch();
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
  //accuracy = score / (total_attempts X 20) x 100 (so percentage format)

  // console.log("caption: "+req.ratings[req.ratings.length-1].caption);
  //add scores to user's total_score
  let score = req.ratings[req.ratings.length - 1].scores;
  // add total_success to users table
  let success = req.ratings[req.ratings.length - 1].success;

  /*
    //calculate the level and add it to the users table
    let levelPoints = 0;
    let level = 0;
    let userSuccessRate = req.total_num_success/req.total_num_attempts;
    if(userSuccessRate>0.25){
        levelPoints = parseInt(req.total_num_attempts*(1+userSuccessRate));
    }
    if(levelPoints != 0 && (levelPoints%100 === 0)){
        level = level+1;
    }
    */

  //    let totalAttempt = (req.total_num_attempts + 1);
  //    let accuracy = (score+req.total_score / (totalAttempt*20)) * 100;

  //increment the userAttempts by one
  let query =
    " UPDATE captionrater.users SET " +
    "total_score = total_score  + " +
    score +
    " , " +
    "level = " +
    req.accuracy +
    " , " +
    "total_num_attempts = total_num_attempts + 1 " +
    " , " +
    "total_num_success = total_num_success + " +
    success +
    " where id = " +
    req.user.id;
  console.log("query is: " + query);
  await db.query(query).then((res) => {
    next();
  });
}

async function getRatingsAveForCap(req, res, next) {
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
}

async function updateConsensus(req, res, next) {
  //calculate consensus using previous ratings for that caption id
  // let prev_users_rate = req.ratings[req.ratings.length -2].rate;
  let new_consensus = -1;

  //Scenario 1 : no consensus
  let current_consensus = req.consensus;
  let len = req.count_rate;
  if (Math.abs(req.body.inlineRadioOptions - current_consensus) <= 2) {
    if (current_consensus === -1) {
      console.log("Scenario 1 : no consensus , length = " + len);
      // #case 1: Case that there is one previous rating
      if (len === 2) {
        let first = req.ratings[len - 2].rate;
        let second = req.ratings[len - 1].rate;
        if (Math.abs(first - second) <= 1) {
          new_consensus = (first + second) / 2;
        }
        console.log(
          "case 1: Case that there is one previous rating and new_consensus = " +
            new_consensus
        );
        // # case 2: Case that there are two previous ratings
      } else if (len === 3) {
        let first = req.ratings[len - 3].rate;
        let second = req.ratings[len - 2].rate;
        let third = req.ratings[len - 1].rate;
        let mean = (first + second + third) / 3;
        let stdev = Math.sqrt(
          (Math.pow(Math.abs(first - mean), 2) +
            Math.pow(Math.abs(second - mean), 2) +
            Math.pow(Math.abs(third - mean), 2)) /
            2
        );
        if (stdev < 1.5) {
          new_consensus = mean;
        } else {
          new_consensus = current_consensus;
        }
        console.log(
          "case 2: Case that there are two previous ratings and new_consensus = " +
            new_consensus
        );
        // # case 3: Case that there are three previous ratings
      } else if (len === 4) {
        let first = req.ratings[len - 4].rate;
        let second = req.ratings[len - 3].rate;
        let third = req.ratings[len - 2].rate;
        let forth = req.ratings[len - 1].rate;
        let mean = (first + second + third + forth) / 4;
        let min = Math.min(first, second, third, forth);
        let max = Math.max(first, second, third, forth);
        let stdev = Math.sqrt(
          (Math.pow(Math.abs(first - mean), 2) +
            Math.pow(Math.abs(second - mean), 2) +
            Math.pow(Math.abs(third - mean), 2) +
            Math.pow(Math.abs(forth - mean), 2)) /
            3
        );
        if (stdev < 1.5) {
          new_consensus = mean;
        } else {
          if (mean >= 2.5) {
            // remove lowest rating and calculate ave
            new_consensus = (first + second + third + forth - min) / 3;
          } else {
            // remove highest rating and calculate ave
            new_consensus = (first + second + third + forth - max) / 3;
          }
        }
        console.log(
          "case 2: Case that there are two previous ratings and new_consensus = " +
            new_consensus
        );
      }
    } else {
      // Scenario 2: There exists a valid consensus

      new_consensus = req.ave_rate;

      console.log(
        "Scenario 2: There exists a valid consensus and new_consensus = " +
          new_consensus
      );
    }
    let query =
      " update captionrater.captions SET consensus = " +
      new_consensus +
      ", total_number_of_rates = total_number_of_rates+1 where cap_id = " +
      req.body.hidden_input;
    console.log(query);
    await db.query(query).then((res) => {
      req.old_consensus = current_consensus;
      req.new_consensus = new_consensus;
      // req.ratings = ratings;
      next();
    });
  } else {
    console.log("rating too far from consensus. Consensus was not updated");
    next();
  }
}

router.get(
  "/play",
  checkIfDataExists,
  getImageidFromCaptions,
  getImageUrlfromImageId,
  getUserInfo,
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
    res.render("play", {
      caption_from_captions: caption_from_captions,
      imgURL: imgURL,
      //    scores : scores,
      total_score: total_score,
      accuracy: req.accuracy.toFixed(2),
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
    });
  }
}

router.post(
  "/play",
  getImageidFromCaptions_playresult,
  getImageUrlfromImageId,
  getCurrentConsensus,
  insertRatings,
  getRatingsInfo,
  getUserInfo,
  updateUsersTable,
  getRatingsAveForCap,
  updateConsensus,
  insertDispute,
  (req, res) => {
    //   "/play_result"
    // console.log("imgURL 2:" + req.imgURL);
    // console.log("req.consensus 2: " + req.consensus);
    var random_good_answer =
      good_guess[Math.floor(Math.random() * good_guess.length)];
    var random_bad_answer =
      bad_guess[Math.floor(Math.random() * bad_guess.length)];
    var random_very_bad_answer =
      very_bad_guess[Math.floor(Math.random() * very_bad_guess.length)];
    var ans;
    if (req.current_score < 1) {
      ans = random_very_bad_answer;
    } else if (req.current_score == 1) {
      ans = random_bad_answer;
    } else if (req.current_score == 3) {
      ans = "So close! Try harder next time!";
    } else {
      ans = random_good_answer;
    }
    // ans = (req.current_score <= 5) ? random_bad_answer : random_good_answer;
    // if(req.consensus == -1){ans = "You will recieve your score later :)"};
    console.log("req.current_score: " + req.current_score);
    console.log("req.imgURL 2: " + req.imgURL);
    console.log("req.consensus 2: " + req.consensus);

    res.redirect(
      url.format({
        pathname: "/play_result",
        query: {
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
  res.redirect("back");
});

module.exports = router;
