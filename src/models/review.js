import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        productid: {
            type: String,
            required: true,
            trim: true,
        },
        userid:{
            type: String,
            required: true,
            trim: true,
        },
        name:{
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        rating:{
            type: Number,
            required: false,
            default: 5
        }
    },
    { timestamps: true }
);
const review = mongoose.model("reviews", reviewSchema);
export default review;