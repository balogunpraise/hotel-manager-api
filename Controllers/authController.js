const mongoose = require('mongoose')
const User = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



//create a JWT token
    const createToken = (user) => {
        return jwt.sign({id: user._id, email: user.email, role: user.role}, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN});
    };

//🍪Create a cookie functionality
const createCookie = (res, token) => {
    return  res.cookie( 'token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: process.env.JWT_COOKIE_EXPIRES_IN              //1000 * 60 * 60 * 24
        });
}

 //Create a new user   
exports.signUp = async(req, res) =>{
    try{
        const {firstName, lastName, email, phone, password} = req.body;

        //check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'Email is already registered'})
        }

        //create new User
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            password
        })
        await newUser.save();

    // 🔐 Auto-login: generate JWT token
        const token = createToken(newUser);

     // 🍪 Set token as HTTP-only cookie 
     createCookie(res, token)  

    // ✅ Return success response
    res.status(201).json({
        status: 'User successfully Created',
        token,
        user:{
             data: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role
            }
        }
    });

    }catch(err){
        return res.status(500).json({
            status:'An error occured',
            error:err.message
        });
    }
};

//Create an Admin User
exports.signUpAdmin = async(req, res) =>{
    const {firstName, lastName, email, phone, password, secret} = req.body;
    if(secret !== process.env.ADMIN_SECRET_KEY){
        return res.status(401).json({message: 'Unauthorized'})
    }
    try{
        const exists = await User.findOne({email})
        if(exists){
            return res.status(400).json({message:'Email already exists'})
        }
        const admin = await User.create({firstName, lastName, email, phone, password, role:'admin'});
       
        //create Admin token
       const token = createToken(admin)

       //Set Admin cookie as http only
       createCookie(res, token) 

        res.status(201).json({
            message: 'Admin signed up succcessfully', 
              data: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                phone: admin.phone,
                role: admin.role
            }})
    }catch(err){
        return res.status(500).json({message: 'server error', error: err.message})
    }
}

//Log in the user
exports.login = async(req, res) =>{
    const {email, password} = req.body
    console.log("Login attempt:", { email, password });
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try{
        const user = await User.findOne({email});
        
        if(!user){
            return res.status(400).json({message: 'Invalid Password or Email'});
        }
        
        const isMatchPassword = await bcrypt.compare(password, user.password)
        if(!isMatchPassword){
            return res.status(400).json({message: 'Invalid credentials'})
        }

        const token = createToken(user);

        //🍪 Set cookie as httpOnly
        createCookie(res, token)

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




exports.deleteUser = async(req, res) =>{
        const {id} = req.params
    try{
        const deletedUser = await User.findByIdAndDelete(id)
        if(!deletedUser){
            return res.status(404).json({
                message: 'User not found',
                status: 'Failed'
            })
        }

        res.status(200).json({
            status: 'Success',
            message: 'User successfully deleted',
            data: null
        })

    }catch(err){
        return res.status(500).json({
            status:'Server error',
            error:err.message
        });
    }
}

exports.getAllUsers = async(req, res) =>{
    try{
        const allUsers = await User.find()
        res.status(200).json({
            status: 'Success',
            message: 'Users successfully fetched',
            users: allUsers
        });
    }catch(err){
        return res.status(500).json({
            status:'Server error',
            error:err.message
        });
    }
}


exports.roleChange = async(req, res) =>{
    try{
        const {userId, role} = req.body

        //Find the User
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }
        //
        const allowedRoles = ['manager', 'receptionist', 'housekeeping'];

        if(!allowedRoles.includes(role)){
            return res.status(400).json({message: 'Invalid role provided'})
        }

        //Ensure a new role is provided
        if(!role || !role.trim()){
            return res.status(400).json({message: 'userId and new role are required'})
        }

        //Use findByIdAndUpdate to update the role
        const updatedRole = await User.findByIdAndUpdate(userId, {role}, {new:true, runValidators: true}) 
        
        //Return a successful role update
        return res.status(200).json({
            status: 'success',
            message:'User role successfully updated',
            data:updatedRole
        })

    }catch(err){
        return res.status(500).json({
            status:'Server error',
            error:err.message
        });
    }
}

exports.removeRole = async(req, res) =>{
        const {id} = req.params
        const {role} = req.body
    try{
        const allowedRoles = ['manager', 'receptionist', 'housekeeping'];
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({
                status: 'Fail',
                message: 'User not found'
            })
        }
       
        if(allowedRoles.includes(user.role)){
             user.role = 'guest'
            await user.save()
         
       return res.status(200).json({
        status: 'Success',
        message: 'User role updated to guest',
        data: user
       })
        }
       else{
        return res.status(400).json({
            status: 'Fail',
            message: 'User does not have the specified role or role is not allowed'
        })
       } 
    }catch(err){
        return res.status(500).json({
            status:'Server error',
            error:err.message
        });
    }
}