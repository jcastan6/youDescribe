

const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const cap_id = 63;



  router.get("/trainingExample2" , (req, res) => {
      // rate = parseInt(req.body.inlineRadioOptions);
      console.log("the rate is :");
      console.log(req.query);
    res.render("trainingExample2", {

    });
    
  });

//   async function getCurrentConsensus(req,res,next){
//     // rate = req.body.inlineRadioOptions;
//     // let query = " SELECT * FROM db.captions where cap_id = " + cap_id;
//     // // console.log(query);
//     await db.execute(query, (err, consensus) => {
//         if(err) throw err;
//         req.consensus = consensus[0].consensus;
//         next();
//     });
// }


async function calculateScore(req,res,next){
    
  //calculateScore and check the success (if true) -> add one to success column
  let current_consensus = 3;
  let current_score = req.query.inlineRadioOptions;
  // console.log("success1 "+req.consensus);
  // console.log("scores1 "+req.scores);
  
  let difference = Math.abs(current_consensus - current_score);
  if(current_consensus === -1){
      current_score = 0;        
  }else{
      if(difference <= 0.1){
          current_score = 200;
      }else if(0.1 <difference <= 0.5){
          current_score = 100;
      }else if(0.5 <difference <= 1){
          current_score = 50;
      }else{
          current_score = 0;
      }

  }
  console.log(current_score);
  req.score = current_score;
  // await ((err, res) => {
  //     if(err) throw err;
  //     req.score = 50;
  next();
  // });
}

// getCurrentConsensus, calculateScore, 
  router.get("/trainingExample2res", calculateScore, (req, res) => {
    // console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
    console.log(req.query.inlineRadioOptions);
    console.log(req.score);   
    let rate = req.query.inlineRadioOptions;
    let score = req.score;
    
    res.render("trainingExample2res", {
      rate : rate,
      score : score

    });
    
  });


  module.exports = router;


//   router.get("/play", getImageidFromCaptions , getImageUrlfromImageId, getUserInfo, (req, res)=>{
//     let caption_from_captions = req.caption_from_captions;
//     let imgURL = req.imgURL;
//     let scores = req.scores;
//     let total_score = req.total_score;
   
//     res.render("play", {
//         caption_from_captions: caption_from_captions,
//         imgURL : imgURL,
//         scores : scores,
//         total_score : total_score,
        

//     });
//   });