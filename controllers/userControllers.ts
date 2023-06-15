import { Request, Response } from "express"
import User, { IUser } from "../models/User"
import Cart, { ICartSchema, IOrderProductSchema } from "../models/Cart"
import Order, { IOrderSchema } from "../models/Order"
import { createToken } from "../authentication/auth"
import bcrypt from "bcrypt"

interface IRegister {
    firstName: IUser["firstName"]
    lastName: IUser["lastName"]
    email: IUser["email"]
    password: IUser["password"]
}

interface IAddToCart {
    cartProductId: IOrderProductSchema["cartProductId"]
    cartName: IOrderProductSchema["cartName"]
    cartColor: IOrderProductSchema["cartColor"]
    cartPictureUrl: IOrderProductSchema["cartPictureUrl"]
    cartQuantity: IOrderProductSchema["cartQuantity"]
    cartPrice: IOrderProductSchema["cartPrice"]
}

export async function register(req: Request, res: Response) {
    try {
        const newUser: IRegister = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        }

        const user = new User(newUser)
        const newCart = new Cart({
            userId: user._id
        })

        const savedUser: IUser = await user.save()
        const savedCart: ICartSchema = await newCart.save()
        return res.status(201).json({ success: "User successfully registered" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export async function login(req: Request, res: Response) {
    try {
        const findUser: IUser | null = await User.findOne({ email: req.body.email })

        if (!findUser) {
            return res.status(404).json({ message: "User not found" })
        }

        const comparePassword: boolean = await bcrypt.compare(req.body.password, findUser.password)

        if (!comparePassword) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const generateToken = createToken(findUser)
        res.cookie("token", generateToken, { httpOnly: true })
        return res.status(200).json({ success: "Login successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export async function logout(req: Request, res: Response) {
    try {
        res.cookie("token", '', { expires: new Date(0), httpOnly: true })
        return res.status(200).json({ success: "Logout successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export async function getUserData(req: Request, res: Response) {
    try {
        const userId = req.verifiedUser?.userId
        const userData: IUser | null = await User.findOne({ _id: userId }, { password: 0 })
        const findCart: ICartSchema | null = await Cart.findOne({ userId: userId })
        const findOrder: IOrderSchema | null = await Order.findOne({ userId: userId })
        return res.status(200).json({ success: userData, findCart, findOrder })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export async function addToCart(req: Request, res: Response) {
    try {
        const userId = req.verifiedUser?.userId
        const findCart: ICartSchema | null = await Cart.findOne({ userId: userId })

        if (!findCart) {
            return res.json("no cart");
        }

        const newOrderProduct: IAddToCart = {
            cartProductId: req.body.cartProductId,
            cartName: req.body.cartName,
            cartColor: req.body.cartColor,
            cartPictureUrl: req.body.cartPictureUrl,
            cartQuantity: req.body.cartQuantity,
            cartPrice: req.body.cartPrice,
        }

        findCart.userCart.push(newOrderProduct as IOrderProductSchema)
        const savedCart: ICartSchema = await findCart.save()
        return res.status(200).json({ success: savedCart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

export async function removeFromCart(req: Request, res: Response) {
    try {
        const userId = req.verifiedUser?.userId
        const cartProductId = req.params.id

        const updatedCart: ICartSchema | null = await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { userCart: { _id: cartProductId } } },
            { new: true }
        ).exec()

        if (!updatedCart) {
            return res.json(false);
        }
        const savedCart: ICartSchema = await updatedCart.save()
        return res.status(200).json({ success: savedCart })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error })
    }
}
