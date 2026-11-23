import pool from '../db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const register = async(req,res) => {
    try {
    const {name ,email,password} = req.body
    if(!name || !email || !password){
        return res.status(409).json({message:"user is already register"})
    }
    const password_hash = await bcrypt.hash(password,10)

    const existing = await pool.query('SELECT * FROM users WHERE email = $1',[email])
        if(existing.rows.length>0){
            res.status(409).json({mssg:"email is already register"})
        }

    const result = await pool.query(
        `INSERT INTO users (name, email,password_hash) VALUES($1,$2,$3) RETURNING id , name , email,role`,[name,email,password_hash]
    )
    res.status(201).json({user:result.rows[0]})
    } catch (err) {
        console.error(err)
        res.status(500).json({mssg:"server error"})
    }
}

const login = async(req,res) =>{
    try {
        const {email,password} = req.body
        if(!email || !password) 
            return res.status(400).json({mssg:"email and password required"})


        const result = await pool.query('SELECT * FROM users WHERE email = $1',[email])
        const user = result.rows[0]

        if(!user){
            return res.status(400).json({mssg:"invalid crediantial"})
        }
        const match = await bcrypt.compare(password,user.password_hash)
        if(!match){
            return res.status(401).json({mssg:"invalid password"})
        }

        const token = jwt.sign(
            {id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1d'})
            res.json({
                token,user:{name:user.name,email:user.email,role:user.role,id:user.id}
            })
        } catch (err) {
        console.error(err)
        return res.status(500).json({message:"server error"})
    }
}

export { register, login }
