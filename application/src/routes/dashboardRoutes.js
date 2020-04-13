const express = require("express");
const router = express.Router();
const db = require("../models/database.js");

async function getUserInfoFromRatings(req, res, next){
    let userID = req.user.id;
    let query = " SELECT * FROM db.ratings R, db.captions C, db.images I where R.captions_cap_id = C.cap_id AND C.images_img_id = I.img_id AND R.users_user_id = "+userID;
    // console.log(query);
    await db.execute(query , (err, ratings) => {
        
        if(err) throw err;
        req.ratings = ratings;
        next();
    });
}


async function getUserInfo(req, res, next){
    let query = " SELECT * FROM db.users where user_id = "+ req.user.id;
    // console.log(query);
    await db.execute(query , (err, users) => {
        
        // console.log(users[3].email);
        if(err) throw err;
        req.users = users;
        next();
    });
}
async function dispute(req, res, next){

    if(req.query.submit === 'Dispute'){
        console.log("this is me");
    
    let query = " SELECT * FROM db.users where user_id = "+ req.user.id;
    // console.log(query);
    await db.execute(query , (err, users) => {
        
        if(err) throw err;
        next();
    });
}else{
    next();
}
}

router.get("/dashboard", getUserInfoFromRatings, getUserInfo, dispute, function(req, res, next) {
    console.log("params: "+req.query.submit);
    console.log("params: "+req.query);
    let ratings = req.ratings;
    let users = req.users;
    // console.log(ratings);
    // console.log(req.ratings[req.ratings.length - 1].caption);
    // console.log("users: "+users);
    // console.log(ratings[0].caption);
    res.render("dashboard", {
        ratings : ratings,
        users : users,
    });
  });


  module.exports = router;