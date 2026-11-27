import pool from '../db.js'

const getHotel = async(req,res) =>{
    try {
        const result = await pool.query("SELECT * FROM hotels ORDER BY created_at DESC")
        res.json(result.rows)
    } catch (err) {
        console.error(err.message)
        res.status(400).json({mssg:"server not found"})
    }
}

const getHotelId = async(req,res) =>{
    try {
        const {id} = req.params;
        const hotelResult = await pool.query("SELECT * FROM hotels WHERE id = $1",[id])
        if(hotelResult.rows.length===0){
            res.json("Hotel not found")
        }
        const roomResult = await pool.query("SELECT * FROM hotels ORDER BY price_per_night",[id])
       res.json({...hotelResult.rows[0],room:roomResult.rows})
    } catch (err) {
        console.error(err.message)
        res.status(500).json({mssg:"Server Error"})
    }
}

const createHotel = async(req,res) =>{
    try {
        
        const {name,city,address,image_url,description} = req.body;
        if(!name || !city){
            return res.status(400).json({mssg:"all fields are required"})
        }
        const result = await pool.query("INSERT INTO hotels (name,city,address,image_url,description) VALUES ($1,$2,$3,$4,$5) RETURNING *",[name,city,address,image_url,description]);

        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({mssg:"server error"})
    }
}

const updateHotel = async(req,res)=>{
    try {
        const {id} = req.params;
        const {name,city,address,img_url,description} = req.body
        const result = await pool.query("UPDATE hotels SET name = COALESCE($1,name),city = COALESCE($2,city),address = COALESCE($3,address),img_url = COALESCE($4,img_url),description = COALESCE($5,descrption) WHERE id = $6 RETURNING *",[id,name,city,address,img_url,description])
        if(result.rows.length ===0){
            return res.status(404).json({mssg:"Hotel not found"})
        }
        res.json(result.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({mssg:"server error"})
    }
}

const deleteHotel = async(req,res) =>{
    try {
        const {id} = req.params;
        const result = await pool.query("DELETE FROM hotels WHERE id = $1 RETURNING ID",[id])
        if(result.rows.length===0){
           return res.status(404).json({mssg:"Hotel Not Found"})
        }
        res.json({mssg:"Hotel Deleted"})
    } catch (err) {
        console.error(err.message)
        res.stauts(500).json({mssg:"servor error"})
    }
}

export {getHotel,getHotelId,createHotel,updateHotel,deleteHotel}