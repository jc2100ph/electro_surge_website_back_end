import { Schema, model } from 'mongoose'

interface IOption {
    color: string
    hex: string
    pictureUrl: string
    price: number
}

interface IProduct {
    name: string
    description: string
    productType: string
    option: IOption[]
    createdOn: Date
}

const optionSchema = new Schema<IOption>({
    color: { type: String, required: true },
    hex: { type: String, required: true },
    pictureUrl: { type: String, required: true },
    price: { type: Number, required: true }
});

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    productType: { type: String, required: true },
    option: [optionSchema],
    createdOn: { type: Date, default: Date.now }
});

export default model<IProduct>("Product", productSchema);
export { IOption, IProduct };
