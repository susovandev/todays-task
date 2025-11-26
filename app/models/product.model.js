import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		image: {
			secure_url: { type: String },
			public_id: { type: String },
		},
	},
	{ timestamps: true, versionKey: false },
);

export default mongoose.model('Product', productSchema);
