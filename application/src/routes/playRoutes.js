const express = require("express");
const router = express.Router();
const db = require("../models/database.js");



async function getImageidFromCaptions(req, res, next){
    let userID = req.user.user_id;
    let query = " SELECT * from db.captions where cap_id NOT IN (SELECT captions_cap_id from db.ratings where users_user_id = "+userID+" ) ";
    console.log(query);
    await db.execute(query , (err, captions) => {
        
        if(err) throw err;
        // console.log("something");
        // console.log(captions[0].images_img_id);
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
async function getCurrentConsensus(req,res,next){
    rate = req.body.inlineRadioOptions;
    let query = " SELECT * FROM db.captions where cap_id = " + req.caption_id;
    console.log(query);
    // console.log(req.body);
    await db.execute(query, (err, consensus) => {
        if(err) throw err;
        req.consensus = consensus[0].consensus;
        next();
    });
}
async function calculateScore(req,res,next){
    if(req.consensus === -1){
        req.score = 0;
        next();
    }
}
async function insertRatings(req,res,next){
    let query = "Insert INTO db.ratings (rate, scores, consensus, users_user_id, captions_cap_id ) VALUES  ( "+ parseInt(req.body.inlineRadioOptions) +", "+ req.score +", "+
    req.consensus +", "+
    req.user.user_id +", "+
    req.caption_id +
    " ) ";
    

    console.log(query);
    await db.execute(query, (err, consensus) => {
        if(err) throw err;
        next();
    });
}

async function updateUsersTable(req,res,next){
    //increment the userAttempts by one

    //add scores to user's total score




    // rate = req.body.inlineRadioOptions;
    // let query = " SELECT * FROM db.captions where cap_id = " + req.caption_id;
    // console.log(query);
    // // console.log(req.body);
    // await db.execute(query, (err, consensus) => {
    //     if(err) throw err;
    //     req.consensus = consensus[0].consensus;
    //     next();
    // });
}





router.get("/play", getImageidFromCaptions , getImageUrlfromImageId, (req, res)=>{
    let caption_from_captions = req.caption_from_captions;
    let imgURL = req.imgURL;
    console.log("img_id_from_captions: "+caption_from_captions);
    console.log("imgURL: "+imgURL);
    // console.log("req.body is: "+req.body)
    res.render("play", {
        caption_from_captions: caption_from_captions,
        imgURL : imgURL,

    });
  });

  router.post("/play", getImageidFromCaptions, getCurrentConsensus, calculateScore,insertRatings,   (req, res)=>{
      console.log("redirect");
    //   console.log("req.body is: "+req.body.inlineRadioOptions);
      
      res.redirect("/play");
  });




  module.exports = router;