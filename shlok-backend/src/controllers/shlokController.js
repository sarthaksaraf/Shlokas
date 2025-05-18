const express = require('express');
const router = express.Router();
const shlokModel = require('../models/shlokModel');
const moods = [
    "Happy",
    "Loneliness",
  "Anxious",
  "Protection",
  "Peace",
  "Sad",
  "Laziness",
  "Anger"
];
const getRandomShlok = async(req,res)=>{
    try{
   const moodShlok = {};

for (const mood of moods) {
  console.log(`Fetching mood: ${mood}`);

  const shloks = await shlokModel.aggregate([
    {
      $match: {
        $expr: {
          $cond: [
            { $isArray: "$mood" },
            { $in: [mood, "$mood"] },
            { $eq: ["$mood", mood] }
          ]
        }
      }
    },
    { $sample: { size: 5 } }
  ]);

  console.log(`Found ${shloks.length} shloks for ${mood}`);
  moodShlok[mood] = shloks;
}

res.json(moodShlok);

}catch(error){
    res.status(500).json({message:error.message});
}
};
module.exports = {
    getRandomShlok
}