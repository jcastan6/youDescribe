const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const fs = require("fs");

async function insertImages(req, res, next) {
  let query = " SELECT * FROM captionrater.ratings ";

  console.log("My database is connected!");

  var i;
  const content = fs.readFileSync(
    "C:/Users/Jose/Documents/captionrater/application/src/newdata/coco_with_pythia_12800-14900_vsepp_ratings.json"
  );

  images = JSON.parse(content).images;
  ratings = JSON.parse(content).annotations;
  processImages(images);
  processCaptions(ratings, db);

  res.send();
}

function processCaptions(ratings, db) {
  for (const rating of ratings) {
    let query = `INSERT INTO captionrater.captions (caption, images_img_id, consensus,dataset_name) VALUES ( "${rating.caption}" , ${rating.image_id}  , ${rating.rating} , "COCO" ) `;
    console.log(query);
    db.query(query).then((results) => {
      results = results[0];
      console.log("The solution is: ", results);

      processRatings(results.insertId, rating.rating);
    });
  }
}

function processRatings(cap_id, consensus) {
  let query = ` INSERT INTO captionrater.ratings (rate , scores, consensus ,users_user_id, captions_cap_id, success) VALUES ( ${consensus} , 20, ${consensus} , 21, ${cap_id}, 1 ) `;

  db.query(query).then((results) => {});
  console.log(query);
  query = ` INSERT INTO captionrater.ratings (rate , scores, consensus ,users_user_id, captions_cap_id, success) VALUES ( ${consensus} , 20, ${consensus} , 22, ${cap_id}, 1 ) `;
  db.query(query).catch();
  console.log(query);
}

function processImages(images) {
  for (const image of images) {
    console.log(image);
    let imgID = image.id;
    let imgName = image.file_name;
    let imgURL = image.coco_url;
    inner(imgID, imgName, imgURL);
  }
}

async function inner(id, name, url) {
  let query =
    "INSERT INTO captionrater.images (img_id, img_name, img_url) VALUES ( " +
    id +
    " , '" +
    name +
    "' , '" +
    url +
    "' ) ";
  db.query(query).catch();
}

router.get("/insertData", insertImages, (req, res, next) => {
  res.render("chooseHome", {});
});

module.exports = router;
