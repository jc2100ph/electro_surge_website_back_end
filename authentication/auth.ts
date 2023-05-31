import { Request, Response, NextFunction } from 'express'
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

interface VerifiedUser {
    email: string
    userId: string
}

declare global {
    namespace Express {
        interface Request {
            verifiedUser?: VerifiedUser;
        }
    }
}

export function createToken(user: any) {
    const payload = {
        email: user.email,
        userId: user._id
    }
    const secret = process.env.JWT_SECRET as string
    const option = { expiresIn: '30m' }

    return jwt.sign(payload, secret, option)
}

export function verifyToken (req: Request, res: Response, next: NextFunction) {
    const secret = process.env.JWT_SECRET as string
    const token = req.cookies.token

    if(!token) {
        return res.json("no token")
    }

    try{
        const decoded =  jwt.verify(token, secret)
        req.verifiedUser = decoded as VerifiedUser
        next()
    }catch(err) {
        console.log(err)
        return res.json(false)
    }
}