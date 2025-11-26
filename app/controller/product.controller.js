import productModel from '../models/product.model.js';
import { StatusCodes } from 'http-status-codes';
import cloudinaryUtils from '../utils/cloudinary.utils.js';
class ProductController {
	async fetchProductsHandler(req, res) {
		try {
			const products = await productModel.find({});
			return res.status(StatusCodes.OK).json({
				status: true,
				message: 'Product fetched successfully',
				data: {
					products: products,
					totalProducts: products.length,
				},
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: false,
				message: error.message,
			});
		}
	}
	async fetchProductHandler(req, res) {
		try {
			const { productId } = req?.params;
			if (!productId) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'Product id is required',
				});
			}
			const product = await productModel.findById(productId);
			if (!product) {
				return res.status(StatusCodes.NOT_FOUND).json({
					status: false,
					message: 'Product not found',
				});
			}
			// Return success Response
			return res.status(StatusCodes.OK).json({
				status: true,
				message: 'User registered successfully',
				data: product,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: false,
				message: error.message,
			});
		}
	}
	async createProductHandler(req, res) {
		try {
			const { title, description, price } = req?.body;
			const productImageLocalFilePath = req?.file?.path;

			// Validation
			if (!title || !description || !price) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'All fields are required',
				});
			}

			// // Upload image to the Cloudinary
			const { secure_url, public_id } =
				await cloudinaryUtils.uploadImageOnCloudinary(
					productImageLocalFilePath,
				);

			// Create Product
			const newProduct = await productModel.create({
				title,
				description,
				price: Number(price),
				image: {
					secure_url: secure_url,
					public_id: public_id,
				},
			});
			if (!newProduct) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					status: false,
					message: 'Failed to create product',
				});
			}

			// Return success Response
			return res.status(StatusCodes.CREATED).json({
				status: true,
				message: 'User registered successfully',
				data: newProduct,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: false,
				message: error.message,
			});
		}
	}
	async updateProductHandler(req, res) {
		try {
			const { productId } = req?.params;
			const { title, description, price } = req?.body;
			const productImageLocalFilePath = req?.file;

			// Validation
			if (!productId) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					status: false,
					message: 'Product id is required',
				});
			}

			// Find product by Id
			const product = await productModel.findById(productId);
			if (!product) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					status: false,
					message: 'Product not found',
				});
			}

			// If user uploads a new image
			if (productImageLocalFilePath) {
				// Delete the existing image from the cloudinary
				await cloudinaryUtils.deleteImageOnCloudinary(
					product?.image?.public_id,
				);
				console.log(
					`Image deleted from cloudinary: ${product?.image?.public_id}`,
				);
				// Upload the new image to the cloudinary
				const { secure_url, public_id } =
					await cloudinaryUtils.uploadImageOnCloudinary(
						productImageLocalFilePath?.path,
					);

				product.image = {
					secure_url: secure_url,
					public_id: public_id,
				};
			}
			// Update Product
			product.title = title;
			product.description = description;
			product.price = Number(price);

			await product.save();

			return res.status(StatusCodes.CREATED).json({
				status: true,
				message: 'Product updated successfully',
				data: product,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: false,
				message: error.message,
			});
		}
	}
	async deleteProductHandler(req, res) {
		try {
			const { productId } = req?.params;

			// Validation
			if (!productId) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					status: false,
					message: 'Product id is required',
				});
			}

			// Find and Delete Product by Id
			const product = await productModel.findByIdAndDelete(productId);
			console.log(product);
			if (!product) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					status: false,
					message: 'Product not found',
				});
			}

			// Delete image from cloudinary
			await cloudinaryUtils.deleteImageOnCloudinary(product?.image?.public_id);
			console.log(`Image deleted successfully: ${product?.image?.public_id}`);

			// Send success response
			return res.status(StatusCodes.CREATED).json({
				status: true,
				message: 'Product deleted successfully',
				data: {},
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: false,
				message: error.message,
			});
		}
	}
}

export default new ProductController();
