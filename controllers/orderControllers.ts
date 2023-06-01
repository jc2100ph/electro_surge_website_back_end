import { Request, Response } from "express"
import Order, {IorderSchema} from "../models/Order"

export async function createOrder(req: Request<IorderSchema>, res:Response){
    try {
        const newOrder = new Order({
            userId: req.verifiedUser?.userId,
            itemQuantity: req.body.itemQuantity,
            totalPrice: req.body.totalPrice,
            address: req.body.address,
        })
        const savedOrder:IorderSchema = await newOrder.save()
        return res.json(true)
    } catch (error) {
        console.log(error)
        return res.json(false)
    }
}

