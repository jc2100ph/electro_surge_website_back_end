import { Request, Response } from "express"
import User, { IUser } from "../models/User"
import Cart, { ICartSchema, IOrderProductSchema } from "../models/Cart"
import Order, { IorderSchema } from "../models/Order"
import { createToken } from "../authentication/auth"
import bcrypt from "bcrypt"

interface ICreateNewUser {
    firstName: IUser["firstName"]
    lastName: IUser["lastName"]
    email: IUser["email"]
    password: IUser["password"]
}

export async function register(req: Request<ICreateNewUser>, res: Response) {
    try {
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        })
        const newCart = new Cart({
            userId: newUser._id
        })
        const savedUser: IUser = await newUser.save()
        const savedCart: ICartSchema = await newCart.save()
        return res.status(201).json({ savedUser, savedCart })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
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
        return res.status(200).json({ message: "Login successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

export async function logout(req: Request, res: Response) {
    try {
        res.cookie("token", '', { expires: new Date(0), httpOnly: true })
        return res.status(200).json({ message: "Logout successful" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error })
    }
}

// export async function getUserData(req: Request, res: Response) {
//     try {
//         const userId = req.verifiedUser?.userId
//         const userData: IUser | null = await User.findOne({ _id: userId }, { password: 0 })
//         const findCart: IcartSchema | null = await Cart.findOne({ userId: userId })
//         const findOrder: IorderSchema | null = await Order.findOne({ userId: userId })

//         let CartTotalPrice = 0
//         findCart?.userCart.forEach((items) => {
//             const pricePerItem = items.orderQuantity * items.orderPrice
//             CartTotalPrice = CartTotalPrice + pricePerItem
//         })

//         return res.json({ userData, findCart, CartTotalPrice, findOrder })
//     } catch (error) {
//         console.log(error)
//         return res.json(false)
//     }
// }

// export async function addToCart(req: Request, res: Response) {
//     try {
//         const userId = req.verifiedUser?.userId
//         const findCart: IcartSchema | null = await Cart.findOne({ userId: userId })

//         if (!findCart) {
//             return res.json("no cart");
//         }

//         const newOrderProduct: IorderProductSchema = {
//             orderProductId: req.body.orderProductId,
//             orderName: req.body.orderName,
//             orderColor: req.body.orderColor,
//             orderPictureUrl: req.body.orderPictureUrl,
//             orderQuantity: req.body.orderQuantity,
//             orderPrice: req.body.orderPrice,
//         };
//         findCart.userCart.push(newOrderProduct)
//         const savedCart = await findCart.save()
//         return res.json(true)
//     } catch (error) {
//         console.log(error)
//         return res.json(false)
//     }
// }

// export async function removeFromCart(req: Request, res: Response) {
//     try {
//         const userId = req.verifiedUser?.userId
//         const cartProductId = req.params.id

//         const updatedCart = await Cart.findOneAndUpdate(
//             { userId: userId },
//             { $pull: { userCart: { _id: cartProductId } } },
//             { new: true }
//         ).exec()

//         if (!updatedCart) {
//             return res.json(false);
//         }

//         return res.json(true)
//     } catch (error) {
//         console.log(error);
//         return res.json(false)
//     }
// }
