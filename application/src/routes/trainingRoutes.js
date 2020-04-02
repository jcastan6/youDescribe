

const express = require("express");
const router = express.Router();
const db = require("../models/database.js");

////////first///////////////////first///////////////////first///////////

router.get("/trainingExample1" , (req, res) => {
  console.log("the rate is :");
  console.log(req.query);
res.render("trainingExample1", {

});

});

async function calculateScore1(req,res,next){

let current_consensus = 4;
let current_score = req.query.inlineRadioOptions;

let difference = Math.abs(current_consensus - current_score);
console.log("diff1: "+difference);
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
console.log("current_score1: "+current_score);
req.score = current_score;
next();

}

router.get("/trainingExample1res", calculateScore1, (req, res) => {
// console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
// console.log(req.query.inlineRadioOptions);
// console.log(req.score);   
let rate = req.query.inlineRadioOptions;
let score = req.score;

res.render("trainingExample1res", {
  rate : rate,
  score : score

});

});


////////second///////////////////second///////////////////second///////////

  router.get("/trainingExample2" , (req, res) => {
      // rate = parseInt(req.body.inlineRadioOptions);
      console.log("the rate is :");
      console.log(req.query);
    res.render("trainingExample2", {

    });
    
  });

async function calculateScore2(req,res,next){
    
  //calculateScore and check the success (if true) -> add one to success column
  let current_consensus = 3;
  let current_score = req.query.inlineRadioOptions;
  
  let difference = Math.abs(current_consensus - current_score);
  console.log("diff2 : "+difference);
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
  console.log(current_score);
  req.score = current_score;
  next();

}

  router.get("/trainingExample2res", calculateScore2, (req, res) => {
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




////////third///////////////////third///////////////////third///////////

router.get("/trainingExample3" , (req, res) => {
  // rate = parseInt(req.body.inlineRadioOptions);
  console.log("the rate is :");
  console.log(req.query);
res.render("trainingExample3", {

});

});

async function calculateScore3(req,res,next){

//calculateScore and check the success (if true) -> add one to success column
let current_consensus = 5;
let current_score = req.query.inlineRadioOptions;

let difference = Math.abs(current_consensus - current_score);
console.log("diff3 : "+difference);
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
console.log(current_score);
req.score = current_score;
next();

}

router.get("/trainingExample3res", calculateScore3, (req, res) => {
// console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
console.log(req.query.inlineRadioOptions);
console.log(req.score);   
let rate = req.query.inlineRadioOptions;
let score = req.score;

res.render("trainingExample3res", {
  rate : rate,
  score : score

});

});



////////forth///////////////////forth///////////////////forth///////////

router.get("/trainingExample4" , (req, res) => {
  // rate = parseInt(req.body.inlineRadioOptions);
  console.log("the rate is :");
  console.log(req.query);
res.render("trainingExample4", {

});

});

async function calculateScore4(req,res,next){

//calculateScore and check the success (if true) -> add one to success column
let current_consensus = 5;
let current_score = req.query.inlineRadioOptions;

let difference = Math.abs(current_consensus - current_score);
console.log("diff4: "+difference);
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
console.log(current_score);
req.score = current_score;
next();

}

router.get("/trainingExample4res", calculateScore4, (req, res) => {
// console.log("rate is: "+parseInt(req.body.inlineRadioOptions));
console.log(req.query.inlineRadioOptions);
console.log(req.score);   
let rate = req.query.inlineRadioOptions;
let score = req.score;

res.render("trainingExample4res", {
  rate : rate,
  score : score

});

});






  module.exports = router;
