import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import userRoutes from "./routes/userRoutes"
import productRoutes from "./routes/productRoutes"
import reviewRoutes from "./routes/reviewRoutes"
import orderRoutes from "./routes/orderRoutes"

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.set("trust proxy", 1)
app.use(cors({
    origin: ["http://localhost:3000", "https://electro-surge-website-front-end.vercel.app"],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Access-Control-Allow-Origin',
        'Content-Type',
        'Authorization'
    ],
    exposedHeaders: 'Set-Cookie'
}));

const dbConnection = async () => {
    try {
        const mongoURI = process.env.MONGO_URI as string
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any)
        console.log("mongoDB is connected")
    } catch (err) {
        console.log(err)
    }
}
dbConnection()

app.use("/user", userRoutes)
app.use("/product", productRoutes)
app.use("/review", reviewRoutes)
app.use("/order", orderRoutes)


app.listen(4000, () => {
    console.log("back end app listening at port 4000")
})
