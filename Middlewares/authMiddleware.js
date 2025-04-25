const jwt = require('jsonwebtoken')

exports.authMiddleware = function (req, res, next){
    //const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") 
        ? req.headers.authorization.split(" ")[1] 
        : null);
        
        console.log('Authorization Header:', req.headers.authorization); // Log the whole authorization header
        console.log('Extracted Token:', token); // Log the extracted token
    if(!token){
        return res.status(401).json({message: 'No token, unauthorized'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
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