import express  from "express";
const router = express.Router()
import { createOrder } from "../controllers/orderControllers"
import { verifyToken } from "../authentication/auth"

router.route("/createOrder").post(verifyToken, createOrder as any)

export default router