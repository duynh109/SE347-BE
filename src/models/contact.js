import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
	c_id: {
		type: String,
		unique: true,
	},
	c_date: {
		type: Date,
		required: true,
	},
	type_p_id: {
		type: String,
	},
	type_p_name: {
		type: String,
	},
	s_id: {
		type: String,
	},
	s_name: {
		type: String,
	},
	message: {
		type: String,
	},
	
},{ timestamps: true });

const Contact = mongoose.model("Contact",contactSchema);
export default Contact;

		
	