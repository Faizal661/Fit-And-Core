import  jwt  from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express';
import { CustomError } from "mern.common";
import dotenv from 'dotenv'
dotenv.config()

const ACCESS_TOKEN=process.env.ACCESS_TOKEN_SECRET||''

// export const verifyToken =(req: Request, res: Response, next: NextFunction)=>{
//     const token =req.cookies.access_token;

//     if(!token) return next(new CustomError("You need to Login first...",401))

//     jwt.verify(token,ACCESS_TOKEN ,(err,user)=>{
//         if(err) return next( new CustomError('Token is invalid !!!',401))

//         // req.user=user
//         next();
//     })

// }