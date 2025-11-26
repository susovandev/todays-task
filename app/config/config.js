import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const config = {
	PORT: process.env.PORT || 5000,
	DATABASE_URL: process.env.DATABASE_URI,
	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
	CLOUDINARY: {
		API_KEY: process.env.CLOUDINARY_API_KEY,
		CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
		API_SECRET: process.env.CLOUDINARY_API_SECRET,
	},
};

export default config;
