INSERT INTO captionrater.probationCaptions (cap_id, caption, images_img_id, ratings, consensus) VALUES
(1,"A boy wearing a red shirt and socks is in a car",21,1,4),
(2,"A girl jumps on the sand",18,1,3),
(3,"Many white puppies are eating food near several brown roosters",21,1,1),
(4,"The young football player is trying to avoid being tackled",20,1,1),
(5,"A woman holding a young girl, and a woman wearing a red dress, sit next to a basket of bread in a grassy field ",20,1,4),
(6,"Snowboarders and skiers watch a sunset from a snow-covered mountain",22,1,5),
(7,"Three people sit at a table under an umbrella outside a cafe",19,1,5),
(8,"A person wearing red is in a car",21,1,3),
(9,"A dog is running along the beach beside the ocean ",18,1,1),
(10,"A boy wearing a soccer uniform holds muddy cleats and sits in a van with an open door.",21,1,5),
(11,"Three people sit at a table under an umbrella ",19,1,4),
(12,"Two women and a young girl wear costumes at a fair and crouch next to a wheelbarrow of bread ",20,1,5),
(13,"Three people under an umbrella",19,1,3),
(14,"A crowd of people at an outdoor event",19,1,2),
(15,"A man sitting in snow ",22,1,3),
(16,"A woman holding a young girl playing with bubbles at a picnic",20,1,2),
(17,"A little girl runs on the wet sand near the ocean",18,1,4),
(18,"Team members being lifted up high to catch a flying ball",22,1,1),
(19,"A woman holding a young girl sit next to a basket",20,1,3),
(20,"a little girl kicks into the air ",18,1,2),
(21,"A girl jumps toward the ocean waves on a sunny beach",18,1,5),
(22,"A young man jumping a back flip off of a concrete wall",19,1,1),
(23,"A man with sunglasses is in a car ",21,1,2),
(24,"People walk in snow on a mountain with a pink sky",22,1,4),
(25,"A man in grey on a white hill, overlooking the ocean",22,1,2);

INSERT INTO captionrater.tutorialCaptions (cap_id,caption,images_img_id,ratings,explanation,consensus) VALUES
(1,"A person crouches on the ground, next to drawings on the sidewalk",4,182,"A viewer would understand what objects are in the image but only able to partially identify some part of the scene, context, or actions that are in the image.",4),
(2,"A dog jumps to catch a Frisbee in the yard",4,179,"A viewer would have a completely wrong understanding of the image. ",1),
(3,"An artist crouches on the ground, drawing sidewalk art with chalk",4,179,"A viewer would accurately understand the objects, and accurately and completely identify the scene, context, and actions that are in the image. ",5),
(4,"A small brown and white dog running through tall grass",17,179,"A viewer would accurately understand the objects, and accurately and completely identify the scene, context, and actions that are in the image. ",5),
(5,"A person sitting on the ground",4,180,"A viewer would have a partial understanding of the objects in the image and no understanding of the scene, context, or actions in the image. ",2),
(6,"A person and drawings on the sidewalk ",4,181,"A viewer would understand what objects are in the image but unable to identify the scene, context, or actions that are in the image.",3),
(7,"A white dog runs through grass",17,185,"A viewer would understand what objects are in the image but only able to partially identify some part of the scene, context, or actions that are in the image.",4),
(8,"Two dogs are playing together outside",17,183,"A viewer would have a partial understanding of the objects in the image and no understanding of the scene, context, or actions in the image. ",2),
(9,"A young boy dressed in a black hoodie crawling through a large, white tube .",17,179,"A viewer would have a completely wrong understanding of the image. ",1),
(10,"A dog rolling in the grass",17,180,"A viewer would understand what objects are in the image but unable to identify the scene, context, or actions that are in the image.",3);

-- Tutorial Images
INSERT INTO captionrater.images (img_id,img_name,img_url,createdAt,updatedAt) VALUES
(4,"https://c4.staticflickr.com/4/3627/3432280295_9bda253b7b_z.jpg","https://c4.staticflickr.com/4/3627/3432280295_9bda253b7b_z.jpg","2021-07-31 07:03:32","2021-07-31 07:03:32"),
(17,"1119015538_e8e796281e.jpg","./1119015538_e8e796281e.jpg","2021-10-27 12:17:07","2021-10-27 12:17:07");


-- Probation Images
INSERT INTO captionrater.images (img_id,img_name,img_url,createdAt,updatedAt) VALUES
(18,"1174525839_7c1e6cfa86.jpg","./1174525839_7c1e6cfa86.jpg","2021-10-27 12:38:06","2021-10-27 12:38:06"),
(19,"1258913059_07c613f7ff.jpg","./1258913059_07c613f7ff.jpg","2021-10-27 12:38:06","2021-10-27 12:38:06"),
(20,"1282392036_5a0328eb86.jpg","./1282392036_5a0328eb86.jpg","2021-10-27 12:38:06","2021-10-27 12:38:06"),
(21,"114051287_dd85625a04.jpg","./114051287_dd85625a04.jpg","2021-10-27 12:38:06","2021-10-27 12:38:06"),
(22,"113678030_87a6a6e42e.jpg","./113678030_87a6a6e42e.jpg","2021-10-27 12:38:06","2021-10-27 12:38:06");