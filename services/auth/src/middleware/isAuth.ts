import {Request, Response, NextFunction} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import { IUser } from "../model/User.js";
import TryCatch from "./trycatch.js";

export interface AuthenticatedRequest extends Request {
    user?: IUser | JwtPayload;
}

export const isAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    try{
        const authHandler = req.headers.authorization;
        console.log("Authorization header:", authHandler);

        if(!authHandler || !authHandler.startsWith("Bearer")){
            return res.status(401).json({message: "Unauthorized user , Please Login - no auth haeder"});
        }

        const token = authHandler.split(" ")[1];
        console.log("Token from header:", token);

        if(!token){
            res.status(401).json({message:"Token missing"});
            return;
        }
        const decodedValue = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
        
        if(!decodedValue || !decodedValue.user){
            res.status(401).json({
                message: "Invalid token",
            });
            return;
        }
        
        req.user = decodedValue.user;
        next();

    } catch(error){
        console.error("Error in isAuth middleware:", error);
        res.status(500).json({message: "Please Login - Jwt error"});

    }

}


