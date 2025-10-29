import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import trackerRouter from './controller/tracker.controller..js'
dotenv.config()

const app = express()
app.use(cors())
app.get("/", async (req,res)=>res.send("server is live !!"))
app.use(express.json())
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