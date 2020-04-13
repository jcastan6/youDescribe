const express = require("express");
const router = express.Router();
const db = require("../models/database.js");
const fs = require('fs');




// async function insertImages(req, res, next) {
//     let query = " SELECT * FROM db.ratings ";
//     console.log("content");


//     await db.execute(query, (err, captions) => {
//         var i;
//         const content = fs.readFileSync('/Users/rayafarshad/Documents/SFSU/SPRING2020/Independent\ Study/JSON/vsepp_glac_with_rating_5000-6000.json');
//         for (i = 0; i < 1000; i++) {
//             // console.log("len : " + JSON.parse(content).images.length)
//             let imgID = JSON.parse(content).images[i].id;
//             let imgName = JSON.parse(content).images[i].file_name;
//             let imgURL = JSON.parse(content).images[i].coco_url;
//             inner(imgID, imgName, imgURL)
//         }
//         if (err) throw err;
//         next();
//     });
// }


// async function inner(id, name, url) {

//     let query = "INSERT INTO db.images (img_id, img_name, img_url) VALUES ( " + id + " , '" + name + "' , '" + url + "' ) ";
//     await db.query(query, (err, res) => {
//         // console.log(query);
//         // console.log("this is me " + id);
//         if (err) throw err;
//     });
// }

// async function insertCaptions(req, res, next) {
//     let query = " SELECT * FROM db.images ";

//     await db.execute(query, (err, images) => {
//         console.log("this is me :" + images[0].img_id);
//         const content = fs.readFileSync('/Users/rayafarshad/Documents/SFSU/SPRING2020/Independent\ Study/JSON/vsepp_pythia_with_rating_8000-9000.json');
//         let json_content = JSON.parse(content).annotations;
        
//         json_content.sort(function(a, b){
//             return a.image_id - b.image_id;
//         });
//         // console.log(json_content);
//         let i;
//         let j;
//         // let caption = json_content[j].caption;
//         // let caption = `dfdfdf it's  "efferfe" somebodys`;
//         // caption = caption.replace(/"/g, "");
//         // console.log(caption);
//         //for each image_id in the images table check the json file if the image is exists then keep the
//         //   caption and image_id and rating/consensus

//         // loop over images in image table 
//         for (i =0; i < 2000; i++) {
//             for (j = 0; j < 1000; j++) {
//                 if (json_content[j].image_id === images[i].img_id) {
//                     let image_id = json_content[j].image_id;
//                     let caption = json_content[j].caption;
//                     caption = caption.replace(/"/g, "");
//                     let rating = json_content[j].rating;
//                     // console.log(image_id);
//                     // console.log(caption);
//                     // console.log(rating);
//                     inner2(image_id, caption,rating);
//                 }
//             }
//         }
        


//         if (err) throw err;
//         next();
//     });
// }

// async function inner2(id, caption, rating) {

//     let query = `INSERT INTO db.captions (caption, images_img_id, consensus) VALUES ( "${caption}" , ${id}  , ${rating} ) `;
//     // let query = "INSERT INTO db.captions (caption, images_img_id, consensus) VALUES ( `"+caption+"` , "+id+ ", "+rating+ " ) ";
//     await db.query(query, (err, res) => {
//         // console.log(query);
//         // console.log("this is me " + id);
//         if (err) throw err;
//     });
// }


async function insertRatings(req, res, next) {
    let query = " SELECT * FROM db.captions ";
    await db.execute(query, (err, captions) => {
        var i;
        for (i = 0; i < captions.length; i++) {
            
            inner(captions[i].cap_id, captions[i].consensus)
        }
        if (err) throw err;
        next();
    });
}
async function inner(cap_id , consensus){

    let query = ` INSERT INTO db.ratings (rate , scores, consensus ,users_user_id, captions_cap_id, success) VALUES ( ${consensus} , 200, ${consensus} , 22, ${cap_id}, 1 ) `;
    await db.query(query , (err, res) => {
        // console.log(query);

        if(err) throw err;

    });
    
}



router.get("/insertData",insertRatings, (req, res, next) => {

    res.render("chooseHome", {


    });
});











module.exports = router;