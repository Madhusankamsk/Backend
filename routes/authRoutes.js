const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");


require('dotenv').config();
const nodemailer = require('nodemailer');


async function mailer(recieveremail, code) {
    //console.log("Mailer function called");

    let transpoter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,

        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.NodeMailer_email,
            pass: process.env.NodeMailer_password
        }
    });

    let info = await transpoter.sendMail({
        from: "Petty Island",
        to: `${recieveremail}`,
        subject: "Email Verification",
        text: `Your Verification Code is ${code}`,
        html: `<b>Your Verification Code is ${code}</b>`
    })

    console.log("Message sent : %s", info.messageId);
    console.log("Preview URL: %s ", nodemailer.getTestMessageUrl(info));
}


router.post('/verify', (req, res) => {
    console.log("Sent By client",req.body);
    const { email } = req.body;

    if(!email){
        return res.status(422).json({error:"Please add all the fields"});
    }

    User.findOne({ email: email }).then(async (savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "Invalid Credentials" });
        }
        try {
            let VerificationCode = Math.floor(100000 + Math.random() * 900000);
            await mailer(email, VerificationCode);
            console.log("Verification Code", VerificationCode);
            //return res.status(200).json({message:"verification code and email",VerificationCode,email});
            res.send({ message: "Verification Code Sent to your Email", VerificationCode, email });
        }
        catch (err) {
            console.log(err);
        }
    }
    )
});


router.post('/changeusername',(req,res)=>{
    const{username,email} = req.body;

    User.find({username}).then(
        async (savedUser)=>{
            if(savedUser.length > 0){
                return res.status(422).json({error:"Username already exists"});
            }
            else{
                return res.status(200).json({message:"Username Available",username,email});
            }
        }
    );
});


router.post('/signup',async (req,res)=>{
    const { username,password,email} = req.body;
    if(!username || !password || !email){
        return res.status(422).json({error:"Please add all the fields"});
    }
    else{
        const user = new User({
            username,
            email,
            password,
        });

        try{
           await user.save();
           const token = jwt.sign({_id: user._id},process.env.JWT_SECRET);
           return res.status(200).json({message:"User Registered Successfully",token});

        }
        catch(err){
            console.log(err);
            return res.status(422).json({error: "User Not Registered"});
        }
    }
});


router.post('/verifyfp', (req, res) => {
    //console.log("Sent By client",req.body);
    const {email } = req.body;

    if(!email){
        return res.status(422).json({error:"Please add all the fields"});
    }

    User.findOne({ email: email }).then(async (savedUser) => {
        console.log(savedUser);
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Credentials" });
        }
        try {
            let VerificationCode = Math.floor(100000 + Math.random() * 900000);
            await mailer(email, VerificationCode);
            console.log("Verification Code", VerificationCode);
            //return res.status(200).json({message:"verification code and email",VerificationCode,email});
            res.send({ message: "Verification Code Sent to your Email", VerificationCode, email });
        }
        catch (err) {
            console.log(err);
        }
    }
    )
});

//$2b$08$nyQCeRIx2d5K0UiyhFen3OY0a8QKsBklDHSFmaYHXj23AJWLiQGTS
//$2b$08$nyQCeRIx2d5K0UiyhFen3OY0a8QKsBklDHSFmaYHXj23AJWLiQGTS
//$2b$08$crUp9AeMGZV4.fjdCrrvvOxFIwxJXeHwg2gVYLdDrq8xe4AZ0um3u

router.post('/resetpassword', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    else {
        User.findOne({ email: email })
            .then(async (savedUser) => {
                if (savedUser) {
                    savedUser.password = password;
                    savedUser.save()
                        .then(user => {
                            res.json({ message: "Password Changed Successfully" });
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
                else {
                    return res.status(422).json({ error: "Invalid Credentials" });
                }
            })
    }

});


router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    else {
        User.findOne({ email: email })
            .then(savedUser => {
                if (!savedUser) {
                    return res.status(422).json({ error: "Invalid Credentials" });
                }
                else {
                    //console.log(savedUser);
                    bcrypt.compare(password, savedUser.password)
                        .then(
                            doMatch => {
                                if (doMatch) {
                                    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);

                                    const { _id, username, email } = savedUser;

                                    res.json({ message: "Successfully Signed In", token, user: { _id, username, email } });
                                }
                                else {
                                    return res.status(422).json({ error: "Invalid Credentials" });
                                }
                            }
                        )
                    // res.status(200).json({ message: "User Logged In Successfully", savedUser });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
});




module.exports = router;