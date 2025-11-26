import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		phone: {
			type: String,
			required: true,
		},
		image: {
			secure_url: { type: String },
			public_id: { type: String },
		},
	},
	{ timestamps: true, versionKey: false },
);

export default mongoose.model('User', userSchema);
