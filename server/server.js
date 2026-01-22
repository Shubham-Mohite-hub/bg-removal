// server.js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/mongodb.js'
import userRouter from './routes/userRoutes.js'
import imageRouter from './routes/imageRoutes.js'

const PORT = process.env.PORT || 4000 
const app = express()

app.use(cors())

// Use express.raw ONLY for the webhook route so it doesn't break other APIs
app.use('/api/user/webhooks', express.raw({ type: 'application/json' }));

// Regular JSON parsing for all other routes
app.use(express.json())

app.use('/api/user', userRouter)

app.get('/', (req, res) => res.send("API Working"))
app.use('/api/image',imageRouter)

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log("✅ Server and Database ready on Port: " + PORT);
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
    }
});