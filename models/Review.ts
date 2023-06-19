import { Schema, model } from 'mongoose'

interface Ireview {
    productId: string
    userId: string
    title: string
    rating: number
    reviewText: string
}

const reviewSchema = new Schema<Ireview>({
    productId: { type: String, required: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0, required: true },
    reviewText: { type: String, required: true },
})

export default model<Ireview>("Review", reviewSchema)
export { Ireview }