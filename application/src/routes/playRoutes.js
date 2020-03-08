const express = require("express");
const router = express.Router();
const db = require("../models/database.js");

async function getImageidFromCaptions(req, res, next){
    await db.execute(" SELECT * FROM captions ", (err, captions) => {
        if(err) throw err;
        // console.log("something");
        // console.log(captions[0].images_img_id);
        req.img_id_from_captions = captions[0].images_img_id;
        next();
    });
}
async function getImageUrlfromImageId(req, res, next){
    let imgID = req.img_id_from_captions;
    let query = " SELECT img_url as img_url  FROM db.images where img_id =  " + imgID;
    console.log("query: "+query);
    await db.execute(query , (err, imgURL) => {
        
        if(err) throw err;
        req.imgURL = imgURL[0].img_url;
        next();
    });
}


router.get("/play", getImageidFromCaptions , getImageUrlfromImageId, (req, res)=>{
    let img_id_from_captions = req.img_id_from_captions;
    let imgURL = req.imgURL;
    console.log("img_id_from_captions: "+img_id_from_captions);
    console.log("imgURL: "+imgURL);
    res.render("play", {
        img_id_from_captions: img_id_from_captions,
        imgURL : imgURL,

    });
  });

  module.exports = router;