const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please enter your name"]
    },
    email: {
        type: String,
        required: [true,"Please enter your Email ID"],
        unique: true
    },
    password: {
        type: String,
        required: [true,"Please enter password"]
    },
    contact_no:{
        type: Number,
        required: [true,"Please enter Contact Number"]
    },
    role: {
        type: String,
        enum: ['user','admin','employer'],
        default: 'admin'
    },
    qualification:{
        type: [String],
    },
    skills:{
        type: [String]
    },
    resume:{
        type: String
    },
    profilePic: {
        type: String
    },
    company_name: {
        type: String
    },
    company_address: {
        type: String
    }
});

userSchema.pre('save',async function (next){
    if(!this.isModified('password'))
        return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

const User = mongoose.model('User',userSchema);
module.exports = User;