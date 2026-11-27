import jwt from "jsonwebtoken"

const protect = (req,res,next) =>{
    const authHeader = req.headers.authorization
    console.log("AUTH HEADER:", req.headers.authorization);
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(400).json({mssg:"token not verified"})
    }

    const token = authHeader.slice(7).trim();

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);
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