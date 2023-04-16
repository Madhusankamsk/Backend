const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.mongo_URL).then(
    ()=>{
        console.log("Database Conntected");
    }
).catch((err)=>{
    console.log('DB connection error : ' + err);
})