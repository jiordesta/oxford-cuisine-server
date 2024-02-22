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
    if(role === 'customer') throw new UnauthorizedError('You are not autherized')
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
    const {id, status} = req.params
    const {role} = req.user

    if(role == 'admin' && !['preparing','serving','delivering','cancelled','pending'].includes(status)) throw new UnauthorizedError("You are not autherized!")
    if(role == 'rider' && !['delivered'].includes(status)) throw new UnauthorizedError("You are not autherized!")
    if(role == 'customer' && !['cancelled'].includes(status)) throw new UnauthorizedError("You are not autherized!")

    const order = await Order.findById(id)
    if(!order) throw new BadRequestError('Order not found')
    if(role == 'customer' && ['cancelled'].includes(status) && !order.status == 'pending') throw new BadRequestError('Cancel only if the status is PENDING')

    await Order.findByIdAndUpdate(id,{status})
    res.status(StatusCodes.OK).json('')
}

export const delete_order = async (req, res) => {
    const {id} = req.params
    const {role} = req.user
    if(role != 'admin') throw new UnauthorizedError('You are not autherized for this action!')
    const order = await Order.findById(id)
    if(!['delivered','cancelled','pending'].includes(order.status)) throw new BadRequestError("Can't delete order if status not (delivered, cancelled, pending")
    await Order.findByIdAndDelete(id)
    res.status(StatusCodes.OK).json('')
}

export const deliver_order = async (req, res) => {
    const {id} = req.params
    const user = await User.findById(req.user.id)
    if(!user) throw new UnauthenticatedError('You must first signin!')
    if(user.role != 'rider') throw new UnauthorizedError('You are not authorized!')
    await Order.findByIdAndUpdate(id,{rider:{id:user.id, name:`${user.fname} ${user.lname}`,image:user.image}, status:'delivering'})
    res.status(StatusCodes.OK).json('')
}