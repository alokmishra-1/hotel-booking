import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import pool from './db.js'
dotenv.config();
import authRouter from './routes/routes.js';


const app = express()
app.use(cors())

app.use(express.json())

app.use('/',authRouter)


app.post('/add-user', async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        const result = await pool.query(
            'INSERT INTO users (name, email,password_hash) VALUES ($1, $2, $3) RETURNING *',
            [name,email,password]
        );

        res.json({
            message: 'User saved successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});


const PORT = process.env.PORT || 5001

app.listen(PORT,async()=>{
    try {
       await pool.query('SELECT 1')
       console.log("database connected") 
    } catch (err) {
        console.error(err.message)        
    }
    console.log(`Server is listening at port 5000`)
})