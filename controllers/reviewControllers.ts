import { Request, Response } from "express"
import Review, { Ireview } from "../models/Review"

interface createReviewBody {
    productId: string
    userId: string
    title: string
    rating: number
    reviewText: string
}

export async function createReview(req: Request<createReviewBody>, res:Response){
    try {
        const newReview = new Review({
            productId: req.body.productId,
            userId: req.verifiedUser?.userId,
            title: req.body.title,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        })
        const savedReview: Ireview = await newReview.save()
        return res.json(true)
    } catch (error) {
        console.log(error)
        res.json(false)
    }
}

export async function getAllReviews(req: Request, res:Response){
    try {
        const { page = 1, limit = 10 } = req.query;
        const productId = req.params.id
        const allReviews: Ireview[] | null = await Review.find({productId: productId})
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))
        .exec();

        const count = await Review.countDocuments({ productId });

        res.json({
            allReviews,
            totalPages: Math.ceil(count / Number(limit)),
            currentPage: page
        });
    } catch (error) {
        console.log(error)
        res.json(false)
    }
}