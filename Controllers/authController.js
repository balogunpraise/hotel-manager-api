const mongoose = require('mongoose')
const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



//create a JWT token
    const createToken = (user) => {
        return jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN});
    };

 //Create a new user   
exports.signUp = async(req, res) =>{
    try{
        const {firstName, lastName, email, phone, password, passwordConfirm} = req.body;
        //check if password matches with passwordConfirm
        if(password !== passwordConfirm){
            return res.status(400).json({message:'Passwords do not match'});
        }

        //check if user already exists
        const existingUser = await User.findOne({email}).select('+password');
        if(existingUser){
            return res.status(400).json({message:'Email is already registered'})
        }

        //create new User
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password,
            passwordConfirm
        })
        await newUser.save();

    // 🔐 Auto-login: generate JWT token
        const token = createToken(newUser);

     // 🍪 Set token as HTTP-only cookie 
     res.cookie( 'token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
     })    

    // ✅ Return success response
    res.status(201).json({
        status: 'User successfully Created',
        token,
        user:{
            data: newUser
        }
    });

    }catch(err){
        return res.status(500).json({
            status:'An error occured',
            error:err.message
        });
    }
};

//Log in the user
exports.login = async(req, res) =>{
    const {email, password} = req.body
    console.log("Login attempt:", { email, password });
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try{
        const user = await User.findOne({email}).select('+password');
        
        if(!user){
            return res.status(400).json({message: 'Invalid Password or Email'});
        }
        
        const isMatchPassword = await bcrypt.compare(password, user.password)
        if(!isMatchPassword){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const token = createToken(user);

        //🍪 Set cookie as httpOnly
        res.cookie( 'token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24
        });
        //Return success response
        res.status(200).json({
            message:'User successfully logged in',
            token,
            data: user
        });

    }catch(err){
        return res.status(500).json({
            status:'Server error',
            error:err.message
        });
    }
}

//Logout
exports.logout = (req, res) =>{
    res.clearCookie('token')
    res.status(200).json({message: 'Logged out successfully'})
}