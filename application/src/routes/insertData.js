const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const fs = require("fs");

async function insertImages(req, res, next) {
  let query = " SELECT * FROM db.ratings ";
  // console.log("content");

  await db.query(query, async (err, captions) => {
    var i;
    const content = fs.readFileSync(
      "C:/Users/Jose/Documents/youDescribe/application/src/newdata/coco_with_pythia_12800-14900_vsepp_ratings.json"
    );

    images = JSON.parse(content).images;
    ratings = JSON.parse(content).annotations;

    await processImages(images);
    await processCaptions(ratings);

    if (err) throw err;
    next();
  });
}

async function processCaptions(ratings) {
  for (const rating of ratings) {
    let query = `INSERT INTO db.captions (caption, images_img_id, consensus,dataset_name) VALUES ( "${rating.caption}" , ${rating.image_id}  , ${rating.rating} , "COCO" ) `;
    console.log(query);
    let caption = await db.query(query);
    caption = caption[0];
    await processRatings(caption.insertId, rating.rating);
  }
}

async function processRatings(cap_id, consensus) {
  let query = ` INSERT INTO db.ratings (rate , scores, consensus ,users_user_id, captions_cap_id, success) VALUES ( ${consensus} , 20, ${consensus} , 21, ${cap_id}, 1 ) `;
  await db.query(query);
  console.log(query);
  query = ` INSERT INTO db.ratings (rate , scores, consensus ,users_user_id, captions_cap_id, success) VALUES ( ${consensus} , 20, ${consensus} , 22, ${cap_id}, 1 ) `;
  await db.query(query);
  console.log(query);
}

async function processImages(images) {
  for (const image of images) {
    console.log(image);
    let imgID = image.id;
    let imgName = image.file_name;
    let imgURL = image.coco_url;
    await inner(imgID, imgName, imgURL);
  }
}

async function inner(id, name, url) {
  let query =
    "INSERT INTO db.images (img_id, img_name, img_url) VALUES ( " +
    id +
    " , '" +
    name +
    "' , '" +
    url +
    "' ) ";
  await db.query(query);
}

router.get("/insertData", insertImages, (req, res, next) => {
  res.render("chooseHome", {});
});

module.exports = router;
