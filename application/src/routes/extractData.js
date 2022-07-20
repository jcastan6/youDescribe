const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const url = require("url");
const fs = require("fs");
const oldData = require("../newdata/old.json");

router.get("/extractData", async (req, res) => {
  let query =
    "SELECT image.img_url as Image, caption.caption as Caption, caption.cap_id as CapID, caption.consensus as Consensus from captions caption LEFT JOIN images image ON caption.images_img_id = image.img_id";
  let images = await db.query(query);
  let array = images[0];

  await process(array);
  let newData = {};

  let array2 = oldData.images;

  await sortNewData(newData, array, array2);

  await res.send(newData);
});

router.get("/extractUserData", async (req, res) => {
  let query = "SELECT id from users;";
  let users = await db.query(query);
  let array = users[0];

  await processUsers(array);
  await res.send(array);
});

//matching old dataset to new dataset
async function sortNewData(newData, array, array2) {
  for (const image of array) {
    key = "http://images.cocodataset.org" + image["Image"] + image["Caption"];
    newData[key] = {};
    newData[key]["2021"] = image;
  }
  for (const image of array2) {
    key = image["Column1"];

    if (newData[key] !== undefined) {
      newData[key]["2020"] = image;
    }
  }
}

async function process(array) {
  //take all ratings, add to the caption/image pairs. Also adds original AI rating
  console.log("this'll take a minute...");
  for (const image of array) {
    let ratingCol = 0;
    if (image.CapID !== undefined) {
      let query =
        "SELECT rate FROM ratings where captions_cap_id =" + image.CapID + ";";
      let ratings = await db.query(query);
      ratings = ratings[0];
      let query2 =
        "SELECT rate FROM aiRatings where captions_cap_id =" +
        image.CapID +
        ";";
      let airating = await db.query(query2);
      airating = airating[0][0];
      image["AI Rating"] = airating["rate"];

      if (ratings !== null) {
        ratingTotal = 0;
        image["Ratings"] = 0;
        for (const rating of ratings) {
          image["Ratings"] += 1;
          image["Z" + ratingCol] = rating.rate;
          ratingTotal += rating.rate;
          ratingCol += 1;
        }
        image["Consensus"] = ratingTotal / ratingCol;
      }
    }
  }
}

async function processUsers(array) {
  console.log("this'll take a minute...");
  for (const user of array) {
    let ratingCol = 0;
    let query =
      "SELECT createdAt FROM ratings where users_user_id =" + user.id + ";";
    let ratings = await db.query(query);
    ratings = ratings[0];
    if (ratings !== null) {
      timeTotal = 0;
      let index = 0;
      user["ratings"] = ratings.length;
      for (const rating of ratings) {
        if (ratings[index + 1] !== undefined) {
          diff = Math.abs(rating.createdAt - ratings[index + 1].createdAt);
          console.log(diff);
          if (diff <= 120000) {
            timeTotal += diff;
          }
        }
        index += 1;
      }
      user["total_time"] = timeTotal * 0.001;
    }
  }
}

module.exports = router;
