import mongoose, { Schema, Document } from 'mongoose'

export interface IOptionSchema extends Document {
    color: string
    hex: string
    pictureUrl: string
    price: number
}

export interface IProductSchema extends Document {
    name: string
    description: string
    productType: string
    option: IOptionSchema[]
    createdOn: Date
}

const optionSchema = new Schema({
    color: { type: String, required: true },
    hex: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    price: { type: Number, required: true }
});

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    productType: { type: String, required: true },
    option: [optionSchema],
    createdOn: { type: Date, default: Date.now }
});

export default mongoose.model<IProductSchema>("Product", productSchema)
