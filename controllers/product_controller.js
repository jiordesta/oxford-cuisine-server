import { StatusCodes } from 'http-status-codes'
import Product from '../models/Product.js'
import { BadRequestError } from '../utils/custom_errors.js'

export const create_product = async (req, res) => {
    const product = await Product.create(req.body)
    if(!product) throw new BadRequestError('Error create dish')
    res.status(StatusCodes.OK).json('')
}

export const fetch_products = async (req, res) => {
    const products = await Product.find({})
    if(!products) throw new BadRequestError('There was an Error fetching the data')
    res.status(StatusCodes.OK).json({products})
}

export const delete_product = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id)
    if(!product) throw new BadRequestError('Error Delete')
    res.status(StatusCodes.OK).json('')
}

export const update_product = async (req, res) => {
    const { id } = req.params;
    const {status} = await Product.findById(id)
    const getNewStatus = () => {
        if(status == 'available'){
            return 'not available'
        }
        return 'available'
    }
    const product = await Product.findByIdAndUpdate(id,{status: getNewStatus()})
    if(!product) throw new BadRequestError('Error Updating')
    res.status(StatusCodes.OK).json('')
}