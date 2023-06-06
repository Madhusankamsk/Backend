const mongoose = require("mongoose");
const bcrypt = require("bcrypt");


const postSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profilepic: {
        type: String,
        default: '',
        // required: true
    },
    posturl: {
        type: String,
        required: true
    },
    postdescrip: {
        type: String,
    },
    like: {
        type: Array,
        default: []
    },
    comment: {
        type: Array,
        default: []
    },



},{
    timestamps: true
})




mongoose.model("Post", postSchema);