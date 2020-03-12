const express = require("express");
const router = express.Router();
const db = require("../models/database.js");

// async function getUserInfoFromRatings(req, res, next){
//     let userID = req.user.user_id;
//     let query = " SELECT rate_id FROM db.ratings where users_user_id = "+userID;
//     console.log(query);
//     await db.execute(query , (err, ratings) => {
        
//         if(err) throw err;
//         req.ratings = ratings;
//         next();
//     });
// }
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



// async function getCaptions(req, res, next){
//     let query = " SELECT cap_id as cap_id FROM db.captions c where c.cap_id IN (SELECT captions_cap_id from db.ratings r where r.users_user_id = "+ req.user.user_id +" AND r.captions_cap_id = c.cap_id) ";
//     console.log(query);
//     await db.execute(query , (err, captions) => {
        
//         if(err) throw err;
//         req.captions = captions;
//         next();
//     });
// }




router.get("/dashboard", getUserInfoFromRatings, function(req, res, next) {
    // console.log(ratings);
    let ratings = req.ratings;
    console.log(ratings);
    console.log(ratings[0].caption);
    res.render("dashboard", {
        ratings : ratings,
    });
  });


  module.exports = router;