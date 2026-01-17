import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import connectDB from './configs/mongodb.js'

// App Config

const PORT = process.env.PORT || 4000 
const app = express()
await connectDB()
// Initialise Middleware 
app.use(express.json())
app.use(cors())

// API Route
app.get('/', (req, res) => res.send("API Working"))

app.listen(PORT, ()=> console.log("Server is Running on Port No. "+PORT)
)