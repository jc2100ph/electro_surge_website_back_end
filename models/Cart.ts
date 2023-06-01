import { Schema, model } from "mongoose"

interface IorderProductSchema {
    orderProductId: string
    orderName: string
    orderColor: string
    orderPictureUrl: string
    orderQuantity: number
    orderPrice: number
}

interface IcartSchema {
    save(): unknown
    userId: string
    userCart: IorderProductSchema[]
}


const orderProductSchema = new Schema<IorderProductSchema> ({
    orderProductId: {type: String, required: true},
    orderName: {type: String, required: true},
    orderColor: {type: String, required: true},
    orderPictureUrl: {type: String, required: true},
    orderQuantity: {type: Number, required: true},
    orderPrice: {type: Number, required: true}
})

const cartSchema = new Schema<IcartSchema> ({
    userId: {type: String, required: true},
    userCart: [orderProductSchema]
})

export default model<IcartSchema>("Cart", cartSchema)
export {IcartSchema, IorderProductSchema}