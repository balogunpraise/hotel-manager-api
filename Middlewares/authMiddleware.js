const jwt = require('jsonwebtoken')
const User = require('../Models/userModel')

exports.authMiddleware = async function (req, res, next){
    try{
    //const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") 
        ? req.headers.authorization.split(" ")[1] 
        : null);
       
    if(!token){
        return res.status(401).json({message: 'No token, unauthorized'});
    }

   
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('id role active')
        if(!user){
            return res.status(401).json({message:'Unauthorized: User not found'})
        }
        req.user = user;
        next()
    }catch(err){
        res.status(401).json({message:'Invalid token'});
    }
}; 

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return res.status(401).json({message: 'You do not have permission to perform this action'})
        }
        next()
    }
}