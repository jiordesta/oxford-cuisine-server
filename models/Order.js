import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
    items: {type: Object},
    customer: {type: String},
    customer_id: {type: mongoose.Schema.Types.ObjectId},
    total: {type: String},
    status:{
        type: String,
        enum: ['pending', 'preparing', 'serving','delivering'],
        default: 'pending'
    }

})
export default mongoose.model('Order', OrderSchema)
