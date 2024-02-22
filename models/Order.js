import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
    items: {type: Object},
    customer: {type: String},
    customer_id: {type: mongoose.Schema.Types.ObjectId},
    total: {type: String},
    status:{
        type: String,
        enum: ['pending', 'preparing', 'serving','delivering', 'delivered','cancelled'],
        default: 'pending'
    },
    rider:{type: Object}

})
export default mongoose.model('Order', OrderSchema)
