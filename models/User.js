const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilepic:{
        type:String,
        default:''
        //required:true
    },
    posts:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    followers:{
        type:Array,
        default:[]
    },
    description:{
        type:String,
        default:''
    }
});

userSchema.pre('save',async function (next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    user.password = await bcrypt.hash(user.password,8);
})


mongoose.model("User",userSchema);