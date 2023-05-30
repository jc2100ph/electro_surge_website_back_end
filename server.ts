import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const app = express()


app.use(express.json())

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


app.listen(4000, () => {
    console.log("back end app listening at port 4000")
})
