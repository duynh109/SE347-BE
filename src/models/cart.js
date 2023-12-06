import mongoose from "mongoose";
import validator from "validator";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        tongtrigia: {
            type: Number,
            required: false,
            default: 0
        },
        sanphams: {
            type: Array,
            required: false,
            default: []
        },
    },
    { timestamps: true }
);
const cart = mongoose.model("carts", cartSchema);
export default cart;