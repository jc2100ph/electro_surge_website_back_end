import express from "express"
import { createReview, getAllReviews, getAllReviewRating } from "../controllers/reviewControllers"
import { verifyToken } from "../authentication/auth"
const router = express.Router()

router.route("/createReview").post(verifyToken, createReview as any)
router.route("/getReviewData/:id").get(getAllReviews)
router.route("/getReviewRatingData/:id").get(getAllReviewRating)

export default router