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
  "Alriiiight!"
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
  "Whomp whomp!"
];

//   async function update_prev_unknown_consensus_ratings(req, res, next){
//     // let userID = req.user.user_id;
//     if(req.old_consensus === -1 && req.new_consensus !== -1){
//     let query = " SELECT * FROM db.ratings where captions_cap_id = "+req.caption_id;
//     console.log("query test : "+query);
//     await db.execute(query , (err, rate) => {
//         var i;
//         console.log("len : "+rate.length);
//         // console.log("rate[0] : "+rate[0].rate_id);
//         // console.log("rate[1] : "+rate[1].rate_id);
//         for(i = 0; i < rate.length ; i++){
//             inner(rate[i].rate_id , req.new_consensus , rate[i].rate, req.caption_id);
//         }
//         console.log("old : "+req.old_consensus);
//         console.log("new : "+req.new_consensus);

//         if(err) throw err;
//         next();
//     });
//     console.log("yaaay!!");
// }else{
//     next();
// }

// }

// async function inner(i , consensus ,rate , caption){
//     //base on the rate and consensus calculate the score and push it in the query
//     //update score and success
//     let difference = Math.abs(consensus - rate);
//     if(consensus === -1){
//         score = 0;
//     }else{
//         if(difference <= 0.1){
//             score = 200;
//             success = 0;
//         }else if(0.1 <difference && difference <= 0.5){
//             score = 100;
//             success = 1;
//         }else if(0.5 <difference && difference <= 1){
//             score = 50;
//             success = 1;
//         }else{
//             score = 0;
//             success = 0;
//         }
//     }
//     let query = "update db.ratings SET consensus = "+consensus+ " ,scores = "+score+" ,success =  "+success+"  where captions_cap_id = "+caption +" and rate_id = "+i;

//     // let userID = req.user.user_id;
//     // let query = " SELECT * from db.captions ";
//     // // console.log(query);
//     await db.query(query , (err, res) => {
//         console.log(query);
//         console.log("this is me " +i);
//         if(err) throw err;
//         // req.caption_id = captions[0].cap_id;
//         // req.img_id_from_captions = captions[0].images_img_id;
//         // req.caption_from_captions = captions[0].caption;
//         // next();
//     });
// }

// async function update_prev_unknown_consensus_users(req, res, next){
//     if(req.old_consensus === -1 && req.new_consensus !== -1){
//     let query = " SELECT users_user_id , SUM(scores) as sum_scores, sum(success) as sum_success, count(rate_id) as total_attempts from db.ratings group by users_user_id ";
//     //calculate level
//     await db.execute(query , (err, rate) => {
//         var i;
//         for(i = 0; i < rate.length ; i++){
//             inner2(rate[i].users_user_id, rate[i].sum_scores, rate[i].sum_success, rate[i].total_attempts);
//             // console.log(rate[i].users_user_id);
//             // console.log(rate[i].sum_scores);
//             // console.log(rate[i].sum_success);
//         }
//         if(err) throw err;
//         next();
//     });
// }else{
//     next();
// }
// }
// async function inner2(user_id , sum_score , sum_success, total_attempts){
//     let levelPoints = 0;
//     let level = 0;
//     let userSuccessRate = sum_success/total_attempts;
//     if(userSuccessRate>0.25){
//         levelPoints = parseInt(total_attempts*(1+userSuccessRate));
//     }
//     if(levelPoints != 0 && (levelPoints%100 === 0)){
//         level = level+1;
//     }
//     let query = " update db.users SET total_score = "+sum_score+ " ,level = "+level+" ,total_num_success =  "+sum_success+"  where user_id = "+user_id;
//     await db.query(query , (err, res) => {
//         console.log(query);

//         if(err) throw err;

//     });

// }

// async function getImageidFromCaptions(req, res, next){
//     let userID = req.user.user_id;
//     let query = " SELECT * from db.captions where cap_id NOT IN (SELECT captions_cap_id from db.ratings where users_user_id = "+userID+" ) ";
//     // console.log(query);
//     await db.execute(query , (err, captions) => {

//         if(err) throw err;
//         req.caption_id = captions[0].cap_id;
//         req.img_id_from_captions = captions[0].images_img_id;
//         req.caption_from_captions = captions[0].caption;
//         next();
//     });
// }

// async function getImageUrlfromImageId(req, res, next){
//     let imgID = req.img_id_from_captions;
//     let query = " SELECT img_url as img_url  FROM db.images where img_id =  " + imgID;
//     // console.log("query: "+query);
//     await db.execute(query , (err, imgURL) => {
//         if(err) throw err;
//         req.imgURL = imgURL[0].img_url;
//         next();
//     });
// }
let global_CapId;
let global_ImgId;
let global_caption;
async function checkIfDataExists(req, res, next) {
  let userID = req.user.id;
  let query =
    " select * from db.captions where cap_id not in(select cap_id from db.captions where (bucket" +
    bucket_num +
    " = 5 or bucket" +
    bucket_num +
    " = 2)) and total_number_of_rates < 5 ";
  await db.query(query, (err, res) => {
    console.log(query);
    if (err) throw err;
    if (res[0] === undefined) {
      bucket_num++;
      checkIfDataExists(req, res, next);
    } else {
      next();
    }
  });
  next();
}

async function getImageidFromCaptions(req, res, next) {
  let userID = req.user.id;

  let query =
    "SELECT * FROM(SELECT * from db.captions where cap_id NOT IN (SELECT captions_cap_id from db.ratings where(users_user_id =" +
    userID +
    " and Consensus > 2.5 and consensus < 4.5) or ( consensus <= 1.5 and users_user_id =" +
    userID +
    ")) and bucket" +
    bucket_num +
    " is not null)  t1 WHERE total_number_of_rates < (Select AVG(total_number_of_rates) from db.captions) ORDER BY RAND()";

  // console.log(userID);
  // console.log(query);

  await db.execute(query, (err, captions) => {
    // console.log("captions[0].cap_id : "+captions[0].cap_id);
    if (err) throw err;
    req.caption_id = captions[0].cap_id;
    req.img_id_from_captions = captions[0].images_img_id;
    req.caption_from_captions = captions[0].caption;
    console.log("bucket:" + bucket_num);
    console.log("req.caption_id " + req.caption_id);
    global_CapId = req.caption_id;
    global_ImgId = req.img_id_from_captions;
    global_caption = req.caption_from_captions;
    next();
  });
}

async function getImageidFromCaptions_playresult(req, res, next) {
  let userID = req.user.id;
  let query = " SELECT * from db.captions ";
  // console.log(userID);

  await db.execute(query, (err, captions) => {
    // console.log("captions[0].cap_id : "+captions[0].cap_id);
    if (err) throw err;
    console.log(req.img_id_from_captions);
    console.log("req.caption_id " + global);
    req.caption_id = global_CapId;
    req.img_id_from_captions = global_ImgId;
    req.caption_from_captions = global_caption;
    next();
  });
}

async function getImageUrlfromImageId(req, res, next) {
  let imgID = req.img_id_from_captions;
  let query =
    " SELECT img_url as img_url  FROM db.images where img_id =  " + imgID;
  console.log("query: " + query);
  await db.execute(query, (err, imgURL) => {
    if (err) throw err;
    req.imgURL = imgURL[0].img_url;
    next();
  });
}

async function getUserInfo(req, res, next) {
  // rate = req.body.inlineRadioOptions;
  let query = " SELECT * FROM db.users where id = " + req.user.id;
  // console.log(query);
  await db.execute(query, (err, users) => {
    if (err) throw err;
    req.total_score = users[0].total_score;
    req.total_num_attempts = users[0].total_num_attempts;
    req.total_num_success = users[0].total_num_success;
    var accuracy = 0;
    var accuracy_divisor = users[0].total_num_attempts * 20;
    var accuracy_divident = users[0].total_score;
    if (accuracy_divisor !== 0) {
      accuracy = (accuracy_divident / accuracy_divisor) * 100;
    }
    req.accuracy = accuracy;
    next();
  });
}

async function getCurrentConsensus(req, res, next) {
  // rate = req.body.inlineRadioOptions;
  let query = " SELECT * FROM db.captions where cap_id = " + req.caption_id;
  // console.log(query);
  await db.execute(query, (err, consensus) => {
    if (err) throw err;

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
  if (current_consensus === -1) {
    current_score = 0;
  } else {
    if (difference <= 0.5) {
      current_score = 20;
      current_success = 1;
    } else if (0.5 < difference && difference <= 0.75) {
      current_score = 10;
      current_success = 1;
    } else if (0.75 < difference && difference <= 1) {
      current_score = 5;
      current_success = 1;
    } else {
      current_score = 0;
      current_success = 0;
    }
    // req.query.inlineRadioOptions
    // parseInt(req.body.inlineRadioOptions)

    console.log("current_consensus: " + current_consensus);
    console.log("current_rate: " + current_rate);
    console.log("difference: " + difference);
    console.log("current_success: " + current_success);
    console.log("current_score: " + current_score);
  }

  let query =
    "Insert INTO db.ratings (rate, scores, consensus, users_user_id, captions_cap_id, success ) VALUES  ( " +
    parseInt(req.body.inlineRadioOptions) +
    ", " +
    current_score +
    ", " +
    current_consensus +
    ", " +
    req.user.id +
    ", " +
    req.caption_id +
    ", " +
    current_success +
    " ) ";

  console.log(query);

  await db.execute(query, (err, res) => {
    req.current_score = current_score;
    if (err) throw err;
    req.rating = res.insertId;
    req.disputed = 0;
    console.log(res);
    next();
  });
}

async function getRatingsInfo(req, res, next) {
  let userID = req.user.id;
  let query =
    " SELECT * FROM db.ratings R, db.captions C, db.images I where R.captions_cap_id = C.cap_id AND C.images_img_id = I.img_id AND R.users_user_id = " +
    userID;
  // console.log(query);
  await db.execute(query, (err, ratings) => {
    // req.current_score = ratings[0].scores;
    if (err) throw err;
    req.ratings = ratings;

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

  var accuracy = 0;
  //  console.log("emaill: "+users[0].total_num_attempts);
  var accuracy_divisor = (req.total_num_attempts + 1) * 20;
  var accuracy_divident = score + req.total_score;
  if (accuracy_divisor !== 0) {
    accuracy = (accuracy_divident / accuracy_divisor) * 100;
  }
  //    let totalAttempt = (req.total_num_attempts + 1);
  //    let accuracy = (score+req.total_score / (totalAttempt*20)) * 100;
  console.log("accuracy: " + accuracy);
  console.log("accuracy_divisor : " + accuracy_divisor);
  console.log("accuracy_divident: " + accuracy_divident);

  //increment the userAttempts by one
  let query =
    " UPDATE db.users SET " +
    "total_score = total_score  + " +
    score +
    " , " +
    "level = " +
    accuracy +
    " , " +
    "total_num_attempts = total_num_attempts + 1 " +
    " , " +
    "total_num_success = total_num_success + " +
    success +
    " where id = " +
    req.user.id;
  console.log("query is: " + query);
  await db.execute(query, (err, res) => {
    if (err) throw err;
    next();
  });
}

async function getRatingsAveForCap(req, res, next) {
  let query =
    "SELECT AVG(rate)  as ave_rate, count(rate) as count_rate FROM db.ratings where captions_cap_id = " +
    req.caption_id;
  console.log("ave " + query);
  await db.execute(query, (err, ratingForEachCaption) => {
    if (err) throw err;
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
    " update db.captions SET consensus = " +
    new_consensus +
    ", total_number_of_rates = total_number_of_rates+1 where cap_id = " +
    req.caption_id;
  console.log("just updated consensus : " + new_consensus);
  console.log(query);
  await db.execute(query, (err, res) => {
    if (err) throw err;
    req.old_consensus = current_consensus;
    req.new_consensus = new_consensus;
    // req.ratings = ratings;
    next();
  });
}

router.get(
  "/play",
  checkIfDataExists,
  getImageidFromCaptions,
  getImageUrlfromImageId,
  getUserInfo,
  (req, res) => {
    let caption_from_captions = req.caption_from_captions;
    let imgURL = req.imgURL;
    // let scores = req.scores;
    let total_score = req.total_score;
    console.log("req.imgURL 1 : " + req.imgURL);
    console.log("req.consensus 1: " + req.consensus);
    res.render("play", {
      caption_from_captions: caption_from_captions,
      imgURL: imgURL,
      //    scores : scores,
      total_score: total_score,
      accuracy: req.accuracy.toFixed(2)
    });
  }
);

async function insertDispute(req, res, next) {
  // console.log("params: "+req.body.image);
  if (req.body.dispute_description !== "undefined") {
    console.log(req.body.dispute_description);
    //     let query = `UPDATE db.ratings SET dispute = 1 WHERE rate = ${req.body.rate} AND scores = ${req.body.scores} AND caption = "${req.body.caption}" AND consensus = ${req.body.consensus} AND users_user_id = ${req.user.id} `;
    let query = `UPDATE db.ratings SET dispute = 1, dispute_desc = "${req.body.dispute_description}" where rate_id = "${req.body.hidden_input}"`;
    console.log(query);
    await db.execute(query, (err, captions) => {
      // console.log(query);
      // req.capID = captions[0].cap_id;
      // console.log(req.capID);
      if (err) throw err;
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
    if (req.current_score < 5) {
      ans = random_very_bad_answer;
    } else if (req.current_score == 5) {
      ans = random_bad_answer;
    } else if (req.current_score == 10) {
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
          disputed: req.disputed
        }
      })
    );
  }
);

router.post("/addDispute", insertDispute, async (req, res) => {
  console.log("dispute added");
  res.redirect("back");
});

module.exports = router;
