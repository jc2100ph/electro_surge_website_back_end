import mongoose, { Schema, Document, } from 'mongoose'
import bcrypt from "bcrypt"


export interface IUser extends Document {
    firstName: string
    lastName: string
    email: string
    password: string
    createdAt: Date
}

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, },
    createdAt: { type: Date, default: Date.now }
})

userSchema.pre<IUser>("save", async function (next: (err?: Error) => void) {
    try {
        if (!/[A-Z]/.test(this.password)) {
            const error: any = new Error("Password requires an uppercase letter")
            return next(error.message)
        }

        if (!/[0-9]/.test(this.password)) {
            const error: any = new Error("Password requires a number")
            return next(error.message)
        }

        if (this.password.length < 10) {
            const error: any = new Error("Password requires a length of at least 10 characters")
            return next(error.message)
        }

        const hashedPassword = await bcrypt.hash(this.password, 10)
        this.password = hashedPassword
        return next()
    } catch (error: any) {
        return next(error)
    }
})
export default mongoose.model<IUser>('User', userSchema)
