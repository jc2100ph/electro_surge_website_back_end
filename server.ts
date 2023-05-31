import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import userRoutes from "./routes/userRoutes"
import productRoutes from "./routes/productRoutes"
import reviewRoutes from "./routes/reviewRoutes"

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())

const dbConnection = async () => {
    try{
        const mongoURI = process.env.MONGO_URI as string
        await mongoose.connect(mongoURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any)
        console.log("mongoDB is connected")
    }catch(err){
        console.log(err)
    }
}
dbConnection()

app.use("/user", userRoutes)
app.use("/product", productRoutes)
app.use("/review", reviewRoutes)


app.listen(4000, () => {
    console.log("back end app listening at port 4000")
})
