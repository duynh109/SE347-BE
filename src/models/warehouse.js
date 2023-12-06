import mongoose from 'mongoose'
import validator from 'validator'
const warehouseSchema=new mongoose.Schema({
   
    maSP: {
        type: String,
        required: true,
        
    },
    tenSP: {
        type: String,
        required: true,
        
    },
    DVT: {
        type: String,
        required: true,
        
    },
    ton_dauKy: {
        type: Number,
        required: true,
    },
    nhap_trongKy: {
        type: Number,
        required: true,
    },
    xuat_trongKy: {
        type: Number,
        required: true,
    },
    ton_cuoiKy: {
        type: Number,
        required: true,
    },
    thang: {
        type: Number,
        required: true,
    }
},{timestamps: true})
const Warehouse=mongoose.model('Warehouse',warehouseSchema)
export default Warehouse 