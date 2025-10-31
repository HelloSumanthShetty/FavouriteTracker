    import {Request,Response,NextFunction} from "express"
    import jwt from "jsonwebtoken"
    import dotenv from "dotenv"
    dotenv.config()
    import { JwtPayload } from "jsonwebtoken";

type currentUser={
    userId:String,
    name:String,
    email:String,
    credits:Number
}

declare global{
  namespace Express {
    interface Request{
      user?:currentUser|JwtPayload
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || ""

 export const verifyToken=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            const token=req.cookies?.token
            if(!token){
                return res.status(404).json({message:"tokens are missing",cookies:false})

            }
            const verify=jwt.verify(token,JWT_SECRET) as currentUser|JwtPayload
            req.user =verify
            next()

        } catch (error:any) {
           return res.status(401).json({error:error,cookies:false})
        }
    }