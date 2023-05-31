import { Request, Response } from "express";
import User, { IUser } from "../models/User"
import bcrypt from "bcrypt"
import { createToken } from "../authentication/auth"

interface RequestRegisterBody{
    firstName: string
    lastName: string
    email: string
    password: string
}

export async function register(req: Request<RequestRegisterBody>, res:Response){
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword 
        })
        await newUser.save()
        return res.json(true)
    } catch (error) {
        console.log(error)
        return res.json(false)
    }
}

export async function login(req: Request<RequestRegisterBody>, res:Response){
    try {
        const findUser: IUser | null = await User.findOne({email: req.body.email})
        
        if(!findUser){
            return res.json("no user")
        }

        const comparePassword : boolean = await bcrypt.compare(req.body.password, findUser.password)

        if(!comparePassword){
            return res.json(false)
        }

        const generateToken = createToken(findUser)
        res.cookie("token", generateToken, {httpOnly: true})
        return res.json(true)
    } catch (error) {
        console.log(error)
        return res.json(false)
    }
}

export async function logout(req: Request, res:Response) {
    try {
        res.cookie("token", '', { expires: new Date(0), httpOnly: true })
        return res.json(true)
    } catch (error) {
        console.log(error)
        return res.json(false)
    }
}

export async function getUserData(req: Request, res:Response) {
    try {
        const userId = req.verifiedUser?.userId
        const userData = await User.findOne({_id: userId},{ password: 0 })
        return res.json(userData)
    } catch (error) {
        console.log(error)
        return res.json(false)
    }
}