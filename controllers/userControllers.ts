import { Request, Response } from "express"
import User, { IUser } from "../models/User"
import Cart, { IcartSchema, IorderProductSchema } from "../models/Cart"
import Order, {IorderSchema} from "../models/Order"
import { createToken } from "../authentication/auth"
import bcrypt from "bcrypt"

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
        const newCart = new Cart({
            userId: newUser._id
        })
        const savedUser: IUser = await newUser.save()
        const savedCart: IcartSchema = await newCart.save()
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
        const userData: IUser | null = await User.findOne({_id: userId},{ password: 0 })
        const findCart: IcartSchema | null  = await Cart.findOne({userId: userId})
        const findOrder: IorderSchema | null = await Order.findOne({userId: userId})
        
        let CartTotalPrice = 0
        findCart?.userCart.forEach((items) =>{
            const pricePerItem = items.orderQuantity * items.orderPrice
            CartTotalPrice = CartTotalPrice + pricePerItem
        })

        return res.json({userData, findCart, CartTotalPrice, findOrder})
    } catch (error) {
        console.log(error)
        return res.json(false)
    }
}

export async function addToCart(req: Request, res:Response) {
    try {
        const userId = req.verifiedUser?.userId
        const findCart: IcartSchema | null  = await Cart.findOne({userId: userId})

        if (!findCart) {
            return res.json("no cart");
        }
        
        const newOrderProduct: IorderProductSchema = {
            orderProductId: req.body.orderProductId,
            orderName: req.body.orderName,
            orderColor: req.body.orderColor,
            orderPictureUrl: req.body.orderPictureUrl,
            orderQuantity: req.body.orderQuantity,
            orderPrice: req.body.orderPrice,
        };
        findCart.userCart.push(newOrderProduct)
        const savedCart = await findCart.save()
        return res.json(true)
    } catch (error) {
        console.log(error)
        return res.json(false)
    }
}

export async function removeFromCart(req: Request, res: Response) {
    try {
        const userId = req.verifiedUser?.userId
        const cartProductId = req.params.id

        const updatedCart = await Cart.findOneAndUpdate(
            { userId: userId },
            { $pull: { userCart: { _id: cartProductId } } },
            { new: true }
        ).exec()

        if (!updatedCart) {
            return res.json(false);
        }

        return res.json(true)
    } catch (error) {
        console.log(error);
        return res.json(false)
    }
}
