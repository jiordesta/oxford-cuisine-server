import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  fname: { type: String },
  lname: { type: String },
  username: { type: String },
  password: { type: String },
  role: {
    type: String,
    enum: ['customer', 'admin', 'rider'],
    default: 'customer'
  },
  image: {type: String},
});
export default mongoose.model("User", UserSchema);