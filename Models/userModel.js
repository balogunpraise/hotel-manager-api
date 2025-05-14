const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')


const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true, 'Please enter your first name']
    },
    lastName:{
        type:String,
        required:[true, 'Please enter your last name']
    },
    email:{
        type:String,
        unique:true,
        required:[true, 'Please enter your email']
    },
    role:{
        type:String,
        enum:['guest', 'receptionist', 'manager', 'admin', 'housekeeping'],
        default:'guest',
    },
    password:{
        type:String,
        minlength:6,
        required:[true, 'Please enter your Password']
    },
    phone: { type: String },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
},{timestamps:true})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256')
           .update(resetToken)
           .digest('hex');

    console.log({resetToken}, this.passwordResetToken)

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
     return resetToken;  
}

module.exports = mongoose.model('User', userSchema)

