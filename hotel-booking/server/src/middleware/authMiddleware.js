import jwt from "jsonwebtoken"

const protect = (req,res,next) =>{
    const authHeader = req.header.authorization
    if(!authHeader || !authHeader.search('Bearer ')){
        return res.status(400).json({mssg:"token not verified"})
    }

    const token = authHeader.split('')[1]

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next();
    } catch (err) {
        res.status(401).json({mssg:"token expiry or invalid"})
    }
}

const adminOnly = (req,res,next) =>{
    if(req.user&&req.role=='admin'){
        return next()
    }
    return res.status(401).json({mssg:"admin access only"})
}

export {protect, adminOnly}