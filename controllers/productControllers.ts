import { Request, Response } from 'express'
import Product, { IOptionSchema, IProductSchema } from '../models/Product'

interface ICreateOptionBody {
    color: IOptionSchema["color"]
    hex: IOptionSchema["hex"]
    pictureUrl: IOptionSchema["pictureUrl"]
    price: IOptionSchema["price"]
}

interface ICreateProductBody {
    name: IProductSchema["name"]
    description: IProductSchema["description"]
    productType: IProductSchema["productType"]
    option: ICreateOptionBody[]
}

export async function createProduct(req: Request, res: Response) {
    try {
        const options: ICreateOptionBody = req.body.options.map((option: ICreateOptionBody) => ({
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
        const savedProduct: IProductSchema = await newProduct.save();
        return res.json(true);
    } catch (error) {
        console.error(error);
        return res.json(false)
    }
}

export async function getProductById(req: Request, res: Response) {
    try {
        const productId = req.params.id
        const singleProduct: IProductSchema | null = await Product.findById(productId);
        return res.json(singleProduct);
    } catch (error) {
        console.log(error);
        return res.json(false);
    }
}