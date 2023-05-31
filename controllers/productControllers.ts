import { Request, Response } from 'express'
import Product, { IOption, IProduct } from '../models/Product'

interface CreateOptionBody {
    color: string
    hex: string
    pictureUrl: string
    price: number
}

interface CreateProductBody{
    name: string
    description: string
    productType: string
    option: CreateOptionBody[]
}

export async function createProduct(req: Request<CreateProductBody>, res:Response){
    try {
        const options: IOption[] = req.body.options.map((option: CreateOptionBody) => ({
            color: option.color,
            hex: option.hex,
            pictureUrl: option.pictureUrl,
            price: option.price,
        }))

        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            productType: req.body.productType,
            option: options,
        })
        const savedProduct: IProduct = await newProduct.save();
        return res.json(true);
    } catch (error) {
        console.error(error);
        return res.json(false)
    }
}

export async function getProductById(req: Request, res:Response){
    try {
        const productId = req.params.id
        const singleProduct: IProduct | null = await Product.findById(productId);
        return res.json(singleProduct);
    } catch (error) {
        console.log(error);
        return res.json(false);
    }
}