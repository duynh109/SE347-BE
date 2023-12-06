import mongoose from "mongoose";

const serviceTypeSchema = new mongoose.Schema({
	svt_id: {
		type: String,
		unique: true,
	},
	svt_name: {
		type: String,
		required: true,
	},
	
    svt_price: {
        type: Number,
        require: true,
    },	
});

const ServiceType = mongoose.model("ServiceType",serviceTypeSchema);
export default ServiceType;