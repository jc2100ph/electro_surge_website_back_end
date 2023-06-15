import express from "express";
const router = express.Router()
import { register, login, logout, getUserData, addToCart, removeFromCart } from "../controllers/userControllers"
import { verifyToken } from "../authentication/auth"

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/getUserData").get(verifyToken, getUserData)
router.route("/addToCart").post(verifyToken, addToCart)
router.route("/removeFromCart/:id").post(verifyToken, removeFromCart)

export default router