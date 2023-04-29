const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
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


module.exports = router