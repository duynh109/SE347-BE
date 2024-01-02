import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            require: true,
            unique: true
        },
        value: Number,
        isUsed: {
            type: Boolean,
            require: true,
            default: false
        }
    },
    { timestamps: true }
);
const Discount = mongoose.model("discounts", discountSchema);
export default Discount;