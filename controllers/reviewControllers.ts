import { Request, Response } from "express"
import Review, { Ireview } from "../models/Review"

interface createReviewBody {
    productId: string
    userId: string
    title: string
    rating: number
    reviewText: string
}

export async function createReview(req: Request<createReviewBody>, res: Response) {
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

export async function getAllReviews(req: Request, res: Response) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const productId = req.params.id
        const allReviews: Ireview[] | null = await Review.find({ productId: productId })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit))
            .exec();

        const count = await Review.countDocuments({ productId })

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

interface getAllReviewRatingBody {
    id: string
    totalRating: number
    totalFiveStarRating: number
    totalFourStarRating: number
    totalThreeStarRating: number
    totalTwoStarRating: number
    totalOneStarRating: number
    averageRating: number
}

export async function getAllReviewRating(req: Request<getAllReviewRatingBody>, res: Response) {
    try {
        const productId = req.params.id
        const allReviews: Ireview[] | null = await Review.find({ productId: productId })
        const reviewAmount = allReviews.length
        let averageRating = 0
        let totalRating = 0
        let totalFiveStarRating = 0
        let totalFourStarRating = 0
        let totalThreeStarRating = 0
        let totalTwoStarRating = 0
        let totalOneStarRating = 0
        allReviews.forEach((review) => {
            totalRating = totalRating + review.rating

            if (review.rating === 5) {
                totalFiveStarRating = totalFiveStarRating + 1
            }

            if (review.rating === 4) {
                totalFourStarRating = totalFourStarRating + 1
            }

            if (review.rating === 3) {
                totalThreeStarRating = totalThreeStarRating + 1
            }

            if (review.rating === 2) {
                totalTwoStarRating = totalTwoStarRating + 1
            }

            if (review.rating === 1) {
                totalOneStarRating = totalOneStarRating + 1
            }
        })

        if (Number.isNaN((totalRating / allReviews.length))) {
            averageRating = 0
        } else {
            averageRating = totalRating / allReviews.length
        }



        return res.json({ averageRating, reviewAmount, totalFiveStarRating, totalFourStarRating, totalThreeStarRating, totalTwoStarRating, totalOneStarRating })
    } catch (error) {
        console.log(error)
        res.json(false)
    }
}
