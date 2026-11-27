import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './db.js'
dotenv.config();
import authRouter from './routes/routes.js';
import hotelRoutes from './routes/hotelRoutes.js'
import roomRoutes from './routes/roomRoutes.js'


const app = express()
app.use(cors())

app.use(express.json())

app.use('/api',authRouter)

app.use('/room',roomRoutes)
app.use('/hotel',hotelRoutes)


const PORT = process.env.PORT || 5001

app.listen(PORT,async()=>{
    try {
       await pool.query('SELECT 1')
       console.log("database connected") 
    } catch (err) {
        console.error(err.message)        
    }
    console.log(`Server is listening at port 5001`)
})