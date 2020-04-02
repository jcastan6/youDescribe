/*
1. At the begining we have caption_id , image_id
2. The user click on submit
3. Now we have new_rate , caption_id , image_id
4. Get the current_consensus from the captions table
5. Calculate the user score based on that
6. Insert score and the consensus(that we calculated the users score base on that) and new_rate , caption_id , image_id into the rating table
7. Insert users total score , total attempt and level to the users table
8. Re calculate the consensus based on the users new_rate and add it to the caption table
*/
const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const url = require('url');   
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
  var bad_guess = [
    "Aw too bad!",
    "Meh!",
    "Better luck next time!",
    "Sorry!",
    "You got it...NOT!",
    "Really?!",
    "Sad story!",
    "Scratching my head!",
    "For realz?!",
    "Lol u wish!",
    "Whomp whomp!",
    "Fail!",
  ];



async function getImageidFromCaptions(req, res, next){
    let userID = req.user.user_id;
    let query = " SELECT * from db.captions where cap_id NOT IN (SELECT captions_cap_id from db.ratings where users_user_id = "+userID+" ) ";
    // console.log(query);
    await db.execute(query , (err, captions) => {
        
        if(err) throw err;
        req.caption_id = captions[0].cap_id;
        req.img_id_from_captions = captions[0].images_img_id;
        req.caption_from_captions = captions[0].caption;
        next();
    });
}

async function getImageUrlfromImageId(req, res, next){
    let imgID = req.img_id_from_captions;
    let query = " SELECT img_url as img_url  FROM db.images where img_id =  " + imgID;
    // console.log("query: "+query);
    await db.execute(query , (err, imgURL) => {        
        if(err) throw err;
        req.imgURL = imgURL[0].img_url;
        next();
    });
}

async function getUserInfo(req,res,next){
    // rate = req.body.inlineRadioOptions;
    let query = " SELECT * FROM db.users where user_id = " + req.user.user_id;
    // console.log(query);
    await db.execute(query, (err, users) => {
        if(err) throw err;
        req.total_score = users[0].total_score;
        req.total_num_attempts = users[0].total_num_attempts;
        req.total_num_success = users[0].total_num_success
        next();
    });
} 

async function getCurrentConsensus(req,res,next){
    // rate = req.body.inlineRadioOptions;
    let query = " SELECT * FROM db.captions where cap_id = " + req.caption_id;
    // console.log(query);
    await db.execute(query, (err, consensus) => {
        if(err) throw err;
        req.consensus = consensus[0].consensus;
        next();
    });
}

async function insertRatings(req,res,next){
    
    //calculateScore and check the success (if true) -> add one to success column
    let current_consensus = req.consensus;
    let current_score = 0;
    console.log("success1 ");
    let current_rate = parseInt(req.body.inlineRadioOptions);
    // console.log("scores1 "+req.query.inlineRadioOptions);
    let current_success = 0;
    let difference = Math.abs(current_consensus - current_rate);
    if(current_consensus === -1){
        current_score = 0;        
    }else{
        if(difference <= 0.1){
            current_score = 200;
        }else if(0.1 < difference && difference <= 0.5){
            current_score = 100;
        }else if(0.5 < difference  &&  difference <= 1){
            current_score = 50;
        }else{
            current_score = 0;
        }
      
      }
    
    let query = "Insert INTO db.ratings (rate, scores, consensus, users_user_id, captions_cap_id, success ) VALUES  ( "+ parseInt(req.body.inlineRadioOptions) +", "+ current_score +", "+
    current_consensus +", "+
    req.user.user_id +", "+
    req.caption_id +", "+
    current_success+
    " ) ";
    
    // console.log(query);
    await db.execute(query, (err, res) => {

        if(err) throw err;
        next();
    });
}

async function getRatingsInfo(req, res, next){
    let userID = req.user.user_id;
    let query = " SELECT * FROM db.ratings R, db.captions C, db.images I where R.captions_cap_id = C.cap_id AND C.images_img_id = I.img_id AND R.users_user_id = "+userID;
    // console.log(query);
    await db.execute(query , (err, ratings) => {
        if(err) throw err;
        req.ratings = ratings;
        next();
    });
}

async function updateUsersTable(req,res,next){

    // console.log("caption: "+req.ratings[req.ratings.length-1].caption);
    //add scores to user's total_score
    let score = req.ratings[req.ratings.length-1].scores;
    // add total_success to users table
    let success = req.ratings[req.ratings.length-1].success;
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
    

    //increment the userAttempts by one
    let query = " UPDATE db.users SET "+
                "total_score = total_score  + "+score+ 
                 " , "+
                 "level = "+level+
                 " , "+
                 "total_num_attempts = total_num_attempts + 1 "+
                 " , "+
                 "total_num_success = total_num_success + "+success+
                 " where user_id = " + req.user.user_id;
    // console.log(query);
    await db.execute(query, (err, res) => {
        if(err) throw err;
        next();
    });   

}

async function getRatingsAveForCap(req, res, next){
    let query = "SELECT AVG(rate)  as ave_rate, count(rate) as count_rate FROM db.ratings where captions_cap_id = "+req.caption_id;
    console.log("ave "+query);
    await db.execute(query , (err, ratingForEachCaption) => {       
        if(err) throw err;
        req.ave_rate = ratingForEachCaption[0].ave_rate;
        req.count_rate = ratingForEachCaption[0].count_rate;
        next();
    });
}

async function updateConsensus(req,res,next){
    //calculate consensus using previous ratings for that caption id
    // let prev_users_rate = req.ratings[req.ratings.length -2].rate;
    let new_consensus = -1;

    //Scenario 1 : no consensus
    let current_consensus = req.consensus;
    let len = req.count_rate;
    if(current_consensus === -1){
        console.log("Scenario 1 : no consensus , length = "+len );
        // #case 1: Case that there is one previous rating
        if(len  === 2){
            let first = req.ratings[len -2].rate;
            let second= req.ratings[len -1].rate;
            if (Math.abs(first - second) <= 1){
                new_consensus = ((first + second)/2);
            }
            console.log("case 1: Case that there is one previous rating and new_consensus = "+new_consensus);
        // # case 2: Case that there are two previous ratings
        }else if(len  === 3){
            let first= req.ratings[len -3].rate;
            let second= req.ratings[len -2].rate;
            let third= req.ratings[len -1].rate;
            let mean = ((first + second + third)/3);
            let stdev = Math.sqrt(((Math.pow(Math.abs(first-mean),2))+ (Math.pow(Math.abs(second-mean),2))+(Math.pow(Math.abs(third-mean),2)))/2);
            if (stdev < 1.5){
                new_consensus = mean;
            }else{
                new_consensus = current_consensus;
            }
            console.log("case 2: Case that there are two previous ratings and new_consensus = "+new_consensus);
            // # case 3: Case that there are three previous ratings
        }else if(len  === 4){
            let first= req.ratings[len  -4].rate;
            let second= req.ratings[len  -3].rate;
            let third= req.ratings[len -2].rate;
            let forth= req.ratings[len  -1].rate;
            let mean = ((first + second + third + forth)/4);
            let min = Math.min(first,second,third,forth);
            let max = Math.max(first,second,third,forth);
            let stdev = Math.sqrt(((Math.pow(Math.abs(first-mean),2))+ (Math.pow(Math.abs(second-mean),2))+(Math.pow(Math.abs(third-mean),2))+(Math.pow(Math.abs(forth-mean),2)))/3);
            if(stdev < 1.5){
                new_consensus = mean;
            }else{
                if(mean >= 2.5){
                    // remove lowest rating and calculate ave
                    new_consensus = (first + second + third + forth - min)/3;
                }else{
                    // remove highest rating and calculate ave
                    new_consensus = (first + second + third + forth - max)/3;
                }
            }
            console.log("case 2: Case that there are two previous ratings and new_consensus = "+new_consensus);

        }
    }else{
        

        // Scenario 2: There exists a valid consensus
        new_consensus = req.ave_rate;
        console.log("Scenario 2: There exists a valid consensus and new_consensus = "+new_consensus);

    }
    let query = " update db.captions SET consensus = "+new_consensus+" where cap_id = "+req.caption_id;
    
    console.log(query);
    await db.execute(query , (err, res) => {
        
        if(err) throw err;
        // req.ratings = ratings;
        next();
    });  
}


router.get("/play", getImageidFromCaptions , getImageUrlfromImageId, getUserInfo, (req, res)=>{
    let caption_from_captions = req.caption_from_captions;
    let imgURL = req.imgURL;
    let scores = req.scores;
    let total_score = req.total_score;
    console.log("url : "+req.imgURL);
   
    res.render("play", {
        caption_from_captions: caption_from_captions,
        imgURL : imgURL,
        scores : scores,
        total_score : total_score,
        

    });
  });


  router.post("/play", getImageidFromCaptions,getImageUrlfromImageId, getCurrentConsensus, insertRatings, getRatingsInfo, getUserInfo, updateUsersTable, getRatingsAveForCap,updateConsensus, (req, res)=>{
    //   "/play_result"
    console.log("imgURL 2:"+req.imgURL);
    var random_good_answer = good_guess[Math.floor(Math.random() * good_guess.length)];
    var random_bad_answer = bad_guess[Math.floor(Math.random() * bad_guess.length)];
    var ans;
    ans = (req.scores < 100) ? random_bad_answer : random_good_answer;
    if(req.consensus == -1){ans = "You will recieve your score later :)"};
      res.redirect(url.format({
          pathname : "/play_result",
          query:{
              "comment" : ans,
              "rate" : parseInt(req.body.inlineRadioOptions),
              "score" : req.scores,
              "consensus" : req.consensus,
              "image" : req.imgURL,
              "caption" : req.caption_from_captions

          }
      }));
  });




  module.exports = router;