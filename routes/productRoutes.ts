import  express  from "express";
const router = express.Router()
import { createProduct, getProductById } from "../controllers/productControllers"

router.route("/create").post(createProduct)
router.route("/getProductData/:id").get(getProductById)

export default router