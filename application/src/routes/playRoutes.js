const express = require("express");
const router = express.Router();
const db = require("../models/database.js");



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

async function getTotalScore(req,res,next){
    rate = req.body.inlineRadioOptions;
    let query = " SELECT * FROM db.users where user_id = " + req.user.user_id;
    // console.log(query);
    await db.execute(query, (err, users) => {
        if(err) throw err;
        req.total_score = users[0].total_score;
        next();
    });
} 



async function getCurrentConsensus(req,res,next){
    rate = req.body.inlineRadioOptions;
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
    // console.log("success1 "+req.consensus);
    // console.log("scores1 "+req.scores);
    let current_success = 0;
    let difference = Math.abs(current_consensus - current_score);
    if(current_consensus === -1){
        current_score = 0;        
    }else{
        if(difference <= 0.1){
            current_score = 200;
            current_success = 0;
        }else if(0.1 <difference <= 0.5){
            current_score = 100;
            current_success = 1;
        }else if(0.5 <difference <= 1){
            current_score = 50;
            current_success = 1;
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
    
    console.log(query);
    await db.execute(query, (err, res) => {
        if(err) throw err;
        // console.log("result ratibgs is: "+res[0]);
        next();
    });
}

    async function getUserInfoFromRatings(req, res, next){
    let userID = req.user.user_id;
    let query = " SELECT * FROM db.ratings R, db.captions C, db.images I where R.captions_cap_id = C.cap_id AND C.images_img_id = I.img_id AND R.users_user_id = "+userID;
    console.log(query);
    await db.execute(query , (err, ratings) => {
        
        if(err) throw err;
        req.ratings = ratings;
        next();
    });
}

async function updateUsersTable(req,res,next){

    console.log("caption: "+req.ratings[req.ratings.length-1].caption);
    //add scores to user's total_score
    let score = req.ratings[req.ratings.length-1].scores;
    // add total_success to users table
    let success = req.ratings[req.ratings.length-1].success;
    //calculate the level and add it to the users table
    let level = 0;


    
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
    console.log(query);
    await db.execute(query, (err, number_user_attempts) => {
        if(err) throw err;
        next();
    });

    

 

    

}

async function updateConsensus(req,res,next){
    //calculate consensus using previous ratings for that caption id
    // let prev_users_rate = req.ratings[req.ratings.length -2].rate;
    let new_consensus = -1;

    //Senario 1 : no consensus
    let current_consensus = req.consensus;
    if(current_consensus === -1){
        if(req.ratings.length === 2){
            let first_users_rate = req.ratings[req.ratings.length -2].rate;
            let second_users_rate = req.ratings[req.ratings.length -1].rate;
            if (Math.abs(first_users_rate - second_users_rate) <= 1){
                new_consensus = ((first_users_rate + second_users_rate)/2);
            }
        }else if(req.ratings.length === 3){
            let first_users_rate = req.ratings[req.ratings.length -3].rate;
            let second_users_rate = req.ratings[req.ratings.length -2].rate;
            let third_users_rate = req.ratings[req.ratings.length -1].rate;
            let ave = ((first_users_rate + second_users_rate + third_users_rate)/3);
        }
    }


    
}





router.get("/play", getImageidFromCaptions , getImageUrlfromImageId, getTotalScore, (req, res)=>{
    let caption_from_captions = req.caption_from_captions;
    let imgURL = req.imgURL;
    let scores = req.scores;
    let total_score = req.total_score;
    // console.log("img_id_from_captions: "+caption_from_captions);
    // console.log("imgURL: "+imgURL);
    // console.log("score3: "+req.scores);
    console.log("mean : ");
    res.render("play", {
        caption_from_captions: caption_from_captions,
        imgURL : imgURL,
        scores : scores,
        total_score : total_score,
        

    });
  });

  //, updateUsersTable_attempts, updateConsensus,

  router.post("/play", getImageidFromCaptions, getCurrentConsensus, insertRatings, getUserInfoFromRatings, updateUsersTable,(req, res)=>{

      res.redirect("/play");
  });




  module.exports = router;