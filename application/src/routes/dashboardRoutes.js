const express = require("express");
const router = express.Router();
const db = require("../models/database.js");




async function getUserInfoFromRatings(req, res, next){
    let userID = req.user.id;
    let query = " SELECT R.rate_id, R.rate, R.scores, R.consensus as consensus, R.users_user_id, R.captions_cap_id, R.success, R.dispute, R.date_time, C.cap_id, C.caption, C.images_img_id, C.dataset_name, I.img_id, I.img_name, I.img_url FROM db.ratings R, db.captions C, db.images I where R.captions_cap_id = C.cap_id AND C.images_img_id = I.img_id AND R.users_user_id ="+userID;
    // console.log("the query is: "+query);
    await db.execute(query , (err, ratings) => {
        
        if(err) throw err;
        req.ratings = ratings;
        // console.log(ratings[0].consensus[0])
        next();
    });
}


async function getUserInfo(req, res, next){
    let query = " SELECT * FROM db.users where id = "+ req.user.id;
    // console.log(query);
    await db.execute(query , (err, users) => {
        
        // console.log(users[3].email);
        if(err) throw err;
        req.users = users;
        var accuracy = 0;
        //  console.log("emaill: "+users[0].total_num_attempts);
         var accuracy_divisor = users[0].total_num_attempts * 20;
         var accuracy_divident = users[0].total_score;
         if(accuracy_divisor !== 0) {
            accuracy = (accuracy_divident/accuracy_divisor) *100
         }
         req.accuracy = accuracy;


        next();
    });
}

async function getUserInfo(req, res, next){
    let query = " SELECT * FROM db.users where id = "+ req.user.id;
    // console.log(query);
    await db.execute(query , (err, users) => {
        
        // console.log(users[3].email);
        if(err) throw err;
        req.users = users;
        var accuracy = 0;
        //  console.log("emaill: "+users[0].total_num_attempts);
         var accuracy_divisor = users[0].total_num_attempts * 20;
         var accuracy_divident = users[0].total_score;
         if(accuracy_divisor !== 0) {
            accuracy = (accuracy_divident/accuracy_divisor) *100
         }
         req.accuracy = accuracy;


        next();
    });
}
async function insertDispute(req, res, next){
    // console.log("params: "+req.body.image);
    if(req.body.dispute_description !== 'undefined'){
        console.log(req.body.dispute_description);
    //     let query = `UPDATE db.ratings SET dispute = 1 WHERE rate = ${req.body.rate} AND scores = ${req.body.scores} AND caption = "${req.body.caption}" AND consensus = ${req.body.consensus} AND users_user_id = ${req.user.id} `;
    let query = `UPDATE db.ratings SET dispute = 1, dispute_desc = "${req.body.dispute_description}" where rate_id = "${req.body.hidden_input}"`
    console.log(query);
    await db.execute(query , (err, captions) => {
        // console.log(query);
        // req.capID = captions[0].cap_id;
        // console.log(req.capID);
        if(err) throw err;
        next();
    });
}
}

async function dispute(req, res, next){
    //console.log("params: "+req.body);

    if(req.body.submit === 'Dispute'){
        // console.log("this is me2");
        let query = `UPDATE db.ratings SET dispute = 1 WHERE rate = ${req.body.rate} AND scores = ${req.body.scores} AND captions_cap_id = ${req.capID} AND consensus = ${req.body.consensus} AND users_user_id = ${req.user.id} `;
    // console.log(query);
    await db.execute(query , (err, captions) => {
        if(err) throw err;
        next();
    });
}else{
    next();
}
}

 //findCaption, dispute,
router.post("/dashboard", getUserInfoFromRatings, getUserInfo, insertDispute, function(req, res, next) {
    
    // console.log("params: "+req.data);
    console.log("body: ", req.body.hidden_input)
    console.log("body: ", req.body.dispute_description)
    let ratings = req.ratings;
    let users = req.users;
    let accuracy = req.accuracy
    // console.log("ratingsPost : "+ratings[2][3]);
    // console.log(req.ratings[req.ratings.length - 1].caption);
    
    // console.log(ratings[0].caption);
    // var accuracy = 0;


    res.render("dashboard", {
       
        ratings : ratings,
        users : users,
        accuracy : accuracy.toFixed(2),


    });
  });




router.get("/dashboard", getUserInfoFromRatings, getUserInfo, function(req, res, next) {

    let ratings = req.ratings;
    let users = req.users;
    let accuracy = req.accuracy
    // console.log("ratingsGet : "+ratings[2].consensus);
    // console.log(req.ratings[req.ratings.length - 1].caption);
    // console.log("users: "+users);
    // console.log("accuracy : "+accuracy.toFixed(2));
    // console.log(ratings[0].caption);
    res.render("dashboard", {
        ratings : ratings,
        users : users,
        accuracy : accuracy.toFixed(2),
    });
  });


  module.exports = router;