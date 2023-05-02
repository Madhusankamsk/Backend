const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const postSchema = new mongoose.Schema({

    posteremail: {
        type: String,
        required: true
    },
    postid:{
        type: String,
    },

},{
    timestamps: true
})




mongoose.model("Post", postSchema);