import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    name: {type: String},
    desc: {type: String},
    price: {type: String},
    status: {
        type: String,
        enum: ['available', 'not available'],
        default: 'available'
    },
})
export default mongoose.model('Product', ProductSchema)