import pool from "../db.js";

const createRoom = async(req,res)=>{
    try {
    const hotel_id = req.params.id;
    const {room_type,price_per_night,total_room,capacity} = req.body

    if(!room_type || !price_per_night || !total_room){
        return res.status(400).json({mssg:"All fields are required"})
    }

    if(price_per_night<=0 || capacity<=0){
        return res.json({mssg:"Price and capacity must be positive"})
    }

    const hotels = await pool.query("SELECT id FROM hotels WHERE id = $1",[hotel_id])
    if(hotels.rows.length===0){
        return res.json({mssg:"Hotel not found"})
    }

    const result = await pool.query(
        "INSERT INTO rooms (room_type,hotel_id,price_per_night,total_room,capacity) VALUES($1,$2,$3,$4,$5) RETURNING *",[
        room_type,hotel_id,price_per_night,total_room || 1,capacity])

    res.status(201).json(result.rows[0])
    } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
}
}

const updateRoom = async (req,res) =>{
    try {
    const {id} = req.params
    const {room_type,price_per_night,total_room,capacity} = req.body

    const result = await pool.query("UPDATE rooms set room_type = COALESCE($1,room_type),price_per_night = COALESCE($1,price_per_night),total_room = COALESCE($1,total_room),capacity = COALESCE($1,capacity), WHERE id = $5 RETURNING*)",[room_type,price_per_night,total_room,capacity,id])

    if(result.rows.length===0){
        return res.json({mssg:"hotel not found"})
    }

    res.status(400).json(result.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({mssg:"Server not found"})
    }
}

const deleteRoom = async(req,res)=>{
    try {
        const {id} = req.params
        const result = await pool.query("DELETE FROM rooms WHERE id = $1 RETURNING *",[id])
        if(result.rows.length === 0){
            return res.status(400).json({mssg:"Hotel not found"})
        }
        res.json({mssg:"Hotel deleted"})
    } catch (err) {
        console.error(err.message)
        res.status(500).json({mssg:"Server Error"})
    }
}

export {createRoom,updateRoom,deleteRoom}