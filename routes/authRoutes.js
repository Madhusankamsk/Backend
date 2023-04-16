const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const jwt = require('jsonwebtoken');

require('dotenv').config();
const nodemailer = require('nodemailer');


async function mailer(recieveremail,code){
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

    console.log("Message sent : %s",info.messageId);
    console.log("Preview URL: %s ", nodemailer.getTestMessageUrl(info));
}


router.post('/verify',(req,res)=>{
    const {email} = req.body;

    //console.log(email);

    if(!email){
        return res.status(422).json({error:"Please add all the fields"});
    }
    else{
        User.findOne({email : email}).then(async(savedUser) => {
            //console.log(savedUser);
            if(savedUser){
                return res.status(422).json({error:"Invalid Credentials"});   
            }
            try{
                let VerificationCode = Math.floor(100000 + Math.random()*900000);
                await mailer(email,VerificationCode);
                return res.status(200).json({message:"Email Sent",VerificationCode,email});
            }
            catch(err){
                return res.status(422).json({error:"Error Sending Email"});   
            }
        })
    }
});


module.exports = router;