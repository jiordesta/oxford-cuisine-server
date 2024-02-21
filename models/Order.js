import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
    items: [{type: mongoose.Types.ObjectId}],
    customer: {type: mongoose.Types.ObjectId},
    status:{
        type: String,
        enum: ['pending', 'preparing', 'serving','delivering'],
        default: 'pending'
    }

})
export default mongoose.model('Order', OrderSchema)
