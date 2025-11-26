import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
	try {
		await mongoose.connect(config.DATABASE_URL);
		console.log(`MONGODB CONNECTED`);
	} catch (error) {
		console.error(`MONGODB CONNECTION FAILED:`, error);
		throw error;
	}
};

export default connectDB;
