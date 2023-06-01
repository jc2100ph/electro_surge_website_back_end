import mongoose, { Schema, model } from "mongoose"

interface IorderSchema {
    userId: mongoose.Schema.Types.ObjectId
    itemQuantity: number
    totalPrice: number
    address: string
    dateOrdered: Date
    status: string
}

const orderSchema = new Schema<IorderSchema> ({
    userId : { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    itemQuantity: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
    address: {type: String, required: true},
    dateOrdered: { type: Date, default: Date.now },
    status: {type: String, default: "shipping"}
})

export default model<IorderSchema>("Order", orderSchema)
export {IorderSchema}