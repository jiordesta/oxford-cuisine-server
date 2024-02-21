import { StatusCodes } from 'http-status-codes'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import {v4} from 'uuid'
import { BadRequestError, UnauthenticatedError, UnauthorizedError } from '../utils/custom_errors.js'

export const create_order = async (req, res) => {
    const {id} = req.user
    const user = await User.findById(id)
    if(!user) throw new UnauthenticatedError('Error')
    const orders = req.body.items.split(',')
    const getTotal = async () => {
        let total = 0.0;
        let items = {};
        for (let i = 0; i < orders.length; i++) {
            const product = await Product.findById(orders[i])
            if(!product) throw new BadRequestError('Error')
            if(product.status == 'not available') throw new BadRequestError("Some products are not available")
            total += parseFloat(product.price)

            if (items[product.name]) {
                items[product.name].quantity++;
            } else {
                items[product.name] = { _id: v4(), name: product.name, quantity: 1 };
            }
        }
        return {total, items}
    }
    const checkout = await getTotal()
    const order = await Order.create({...checkout, customer:`${user.fname} ${user.lname}`,customer_id:id})
    if(!order) throw new BadRequestError('Error placing the order')
    res.status(StatusCodes.OK).json('')
}

export const fetch_orders = async (req, res) => {
    const {role} = req.user
    if(role !== 'admin') throw new UnauthorizedError('You are not autherized')
    const orders = await Order.find({})
    if(!orders) throw new BadRequestError('Error')
    return res.status(StatusCodes.OK).json({orders})
}

export const fetch_my_orders = async (req, res) => {
    const {id} = req.user
    const orders = await Order.find({customer_id: id})
    if(!orders) throw new BadRequestError('Error')
    return res.status(StatusCodes.OK).json({orders})
}

export const update_status = async (req, res) =>{
    const {id} = req.params
    const {status} = req.body
    const {role} = req.user
    if(role != 'admin') throw new UnauthorizedError('Error')
    await Order.findByIdAndUpdate(id,{status})
    res.status(StatusCodes.OK).json('')
}