import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs';
import config from '../config/config.js';

// Configure Cloudinary
cloudinary.config({
	cloud_name: config.CLOUDINARY.CLOUD_NAME,
	api_key: config.CLOUDINARY.API_KEY,
	api_secret: config.CLOUDINARY.API_SECRET,
});

class CloudinaryService {
	unlinkLocalFile(localFilePath) {
		if (fs.existsSync(localFilePath)) {
			fs.unlinkSync(localFilePath);
			console.log(`Temp file removes: ${localFilePath}`);
		}
	}

	async uploadImageOnCloudinary(localFilePath) {
		if (!localFilePath) {
			console.error('No local file path provided for image upload');
		}

		try {
			const uploadResult = await cloudinary.uploader.upload(localFilePath, {
				folder: 'auth-curd',
				resource_type: 'image',
			});

			// console.log(`uploadResult: ${JSON.stringify(uploadResult)}`);
			return {
				secure_url: uploadResult?.secure_url,
				public_id: uploadResult?.public_id,
			};
		} catch (error) {
			console.error('Failed to upload file to Cloudinary');
		} finally {
			this.unlinkLocalFile(localFilePath);
			console.log(`Temp file removed: ${localFilePath}`);
		}
	}

	async deleteImageOnCloudinary(publicId) {
		try {
			const result = await cloudinary.uploader.destroy(publicId, {
				resource_type: 'image',
			});

			if (result.result !== 'ok') {
				console.error(
					`Image deletion returned unexpected result: ${result.result}`,
				);
				return;
			}

			console.log(`Image deleted from cloudinary: ${publicId}`);
		} catch (error) {
			console.error('Failed to delete image from Cloudinary');
		}
	}
}

export default new CloudinaryService();
