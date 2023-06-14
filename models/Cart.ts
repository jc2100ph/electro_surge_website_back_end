import mongoose, { Schema, Document } from "mongoose"

export interface IOrderProductSchema extends Document {
    cartProductId: mongoose.Types.ObjectId
    cartName: string
    cartColor: string
    cartPictureUrl: string
    cartQuantity: number
    cartPrice: number
}

export interface ICartSchema extends Document {
    userId: mongoose.Types.ObjectId
    userCart: IOrderProductSchema[]
}


const orderProductSchema = new Schema({
    cartProductId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    cartName: { type: String, required: true },
    cartColor: { type: String, required: true },
    cartPictureUrl: { type: String, required: true },
    cartQuantity: { type: Number, required: true },
    cartPrice: { type: Number, required: true }
})

const cartSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userCart: [orderProductSchema]
})

export default mongoose.model<ICartSchema>("Cart", cartSchema)
