const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const url = require('url');

router.get("/extractData", async (req, res) => {
    let query = "SELECT image.img_url as Image, caption.caption as Caption, caption.cap_id as CapID, caption.consensus as Consensus from captions caption LEFT JOIN images image ON caption.images_img_id = image.img_id";
    let images = await db.query(query);
    let array = images[0]

    await process(array);
    await res.send(array);
});

async function process(array){
    for(const image of array){
        let ratingCol = 0;
        if(image.CapID !== undefined){
            let query = "SELECT rate FROM ratings where captions_cap_id =" + image.CapID + ";"
            let ratings = await db.query(query);
            ratings = ratings[0]
            if(ratings !== null){
                for(const rating of ratings){
                    image['Z'+ ratingCol] = rating.rate;
                    ratingCol += 1;
                }
            }
        }
        console.log(image);
    }
}

module.exports = router;