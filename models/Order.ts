import mongoose, { Schema, Document } from "mongoose"

export interface IOrderSchema extends Document {
    userId: mongoose.Schema.Types.ObjectId
    itemQuantity: number
    totalPrice: number
    address: string
    dateOrdered: Date
    status: string
}

const orderSchema = new Schema<IOrderSchema>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    dateOrdered: { type: Date, default: Date.now },
    status: { type: String, default: "shipping" }
})

export default mongoose.model<IOrderSchema>("Order", orderSchema)
