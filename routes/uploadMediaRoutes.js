const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require('dotenv').config();
const nodemailer = require('nodemailer');

router.post('/setprofilepic',(req,res)=>{
    const {email,profilepic} = req.body;

    User.findOne({ email: email })
    .then(async savedUser => {
        //console.log(savedUser)
        if (savedUser) {
            savedUser.profilepic = profilepic;
            savedUser.save()
                .then(user => {
                    res.json({ message: "Profile picture updated successfully" });
                })
                .catch(err => {
                    return res.status(422).json({ error: "Server Error" });
                })
        }
        else {
            return res.status(422).json({ error: "Invalid Credentials" });
        }
    })
});

router.post('/addpost', (req, res) => {
    const { email, post, postdescription } = req.body;

    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Credentials" })
            }
            savedUser.posts.push({ post, postdescription, likes: [], comments: [] });


            //console.log(savedUser)


            //to do task

            // const no = savedUser.followers.length
            // {
            //     savedUser.followers.map((a)=>{
            //         //console.log(a);
            //         User.findOne({ email: a })
            //         .then((m) => {
            //             // if (!m) {
            //             //     return res.status(422).json({ error: "Invalid Credentials" })
            //             // }
            //             console.log(m._id);
            //             })
            //     })
            // }
            
            const postr = new Post({username:savedUser.username,email:savedUser.email,profilepic: savedUser.profilepic, posturl:post,postdescrip:postdescription})
            console.log(postr);
            postr.save();



            savedUser.save()
                .then(user => {
                    res.json({ message: "Post added successfully" })
                })
                .catch(err => {
                    res.json({ error: "Error adding post" })
                })
        })
        .catch(err => {
            console.log(err);
        })
});


// router.post('/feedwall',(req,res)=>{
//     const {email} = req.body

//     Post.findOne({email:email})
//     .then(( postdata)=>{

//         res.status(200).json({ message: "Done" });

//          console.log(postdata)
//     })

// })


router.get('/feedwall', async (req, res) => {
    try {
      const posts = await Post.find({}).sort({ timestamp: -1 });
      res.json(posts);
      console.log(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching posts' });
    }
  });
  
router.post('./like',async(req,res) =>{
    try {
        const { userId,posterId } = req.body;
        console.log(userId)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
})


module.exports = router