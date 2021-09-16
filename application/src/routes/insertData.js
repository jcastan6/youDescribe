const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const fs = require("fs");

async function insertImages(req, res, next) {
  let query = " SELECT * FROM captionrater.ratings ";

  console.log("My database is connected!");

  var i;
  // const content = fs.readFileSync(
  //   "C:\\Users\\Jose\\Documents\\captionrater\\application\\src\\newdata\\coco_human_11400-12800_vsepp_ratings.json"
  // );

  var files = fs.readdirSync(
    "C:\\Users\\Jose\\Documents\\captionrater\\application\\src\\newdata\\"
  );

  files.forEach((file) => {
    const content = fs.readFileSync(
      `C:\\Users\\Jose\\Documents\\captionrater\\application\\src\\newdata\\${file}`
    );
    images = JSON.parse(content).images;

    ratings = JSON.parse(content).annotations;
    //processImages(images);
    processCaptions(ratings, db);
  });

  res.send();
}

function processCaptions(ratings, db) {
  for (const rating of ratings) {
    let query = `INSERT INTO captionrater.captions (caption, images_img_id, consensus,dataset_name) VALUES ( "${rating.caption}" , ${rating.id}  , ${rating.rating} , "COCO" ) `;
    console.log(query);
    db.query(query).then((results) => {
      results = results[0];
      processAIRatings(results.insertId, rating.rating);
    });
  }
}

function processRatings(cap_id, consensus) {
  let query = ` INSERT INTO captionrater.ratings (rate , scores, consensus ,users_user_id, captions_cap_id, success) VALUES ( ${consensus} , 3, ${consensus}, 1, ${cap_id}, 1 ) `;
  db.query(query).then((results) => {});
  console.log(query);
}

function processAIRatings(cap_id, consensus) {
  let query = ` INSERT INTO captionrater.aiRatings (rate , scores, consensus ,users_user_id, captions_cap_id, success) VALUES ( ${consensus} , 3, ${consensus}, 1, ${cap_id}, 1 ) `;
  db.query(query).then((results) => {});
  console.log(query);
}

function processImages(images) {
  for (const image of images) {
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
  console.log(query);
  db.query(query).catch(() => console.log(query));
}

router.get("/insertData", insertImages, (req, res, next) => {
  res.render("chooseHome", {});
});

module.exports = router;
