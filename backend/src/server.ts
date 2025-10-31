import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import trackerRouter from './controller/tracker.controller..js'
import UserRouter from './controller/user.controller.js' 
import cookieParser from 'cookie-parser'   
dotenv.config()

const app = express()
app.use(cors(
{
        origin:process.env.CORS_ORIGIN,
        credentials:true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    }
))
app.get("/", async (req,res)=>res.send("server is live !!"))
app.use(express.json())
app.use(cookieParser())

app.use("/api/users", UserRouter)
app.use("/api/entries", trackerRouter)

const start = async (): Promise<void> => {
    const port = Number(process.env.PORT) || 4000
    try { 
        app.listen(port, () => console.log(`server is running on ${port}`))
    }

    catch (error) {
        console.error(`failed to connect to ${port}` + error)
    }
}
start()