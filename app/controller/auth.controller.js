import { StatusCodes } from 'http-status-codes';
import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { signAccessToken } from '../helper/auth.helper.js';
import cloudinaryUtils from '../utils/cloudinary.utils.js';

class AuthController {
	async registerHandler(req, res) {
		try {
			const { username, email, password, phone } = req.body;
			const userImageLocalFilePath = req?.file?.path;
			console.log(userImageLocalFilePath);

			// Validation
			if (
				!username ||
				!email ||
				!password ||
				!phone ||
				!userImageLocalFilePath
			) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'All fields are required',
				});
			}

			// Check if email is valid
			if (!email.includes('@')) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'Invalid email address',
				});
			}

			// Check if user already exists
			const user = await userModel.findOne({ email });
			if (user) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'User already exists',
				});
			}

			// Upload image pn cloudinary
			const { secure_url, public_id } =
				await cloudinaryUtils.uploadImageOnCloudinary(userImageLocalFilePath);
			// const hashPassword = hashPassword(password);
			const hashPassword = bcrypt.hashSync(password, 10);
			console.log(hashPassword);
			const newUser = await userModel.create({
				username,
				email,
				password: hashPassword,
				phone,
				image: {
					secure_url,
					public_id,
				},
			});

			return res.status(StatusCodes.CREATED).json({
				status: true,
				message: 'User registered successfully',
				data: {
					user: {
						_id: newUser._id,
						username: newUser.username,
						email: newUser.email,
						phone: newUser.phone,
						image: newUser.image?.secure_url,
					},
				},
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: false,
				message: error.message,
			});
		}
	}
	async loginHandler(req, res) {
		try {
			const { email, password } = req.body;
			// Validation
			if (!email || !password) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'All fields are required',
				});
			}

			// Check if email is valid
			if (!email.includes('@')) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'Invalid email address',
				});
			}

			// Check if user already exists
			const user = await userModel.findOne({ email }).select('+password');
			if (!user) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'User not found',
				});
			}

			// Compare Password
			const isPasswordValid = bcrypt.compareSync(password, user.password);
			if (!isPasswordValid) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'Invalid password',
				});
			}

			// Generate Access Token
			const accessToken = signAccessToken(user);
			if (!accessToken) {
				return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
					status: false,
					message: 'Access token not generated',
				});
			}

			return res.status(StatusCodes.OK).json({
				status: true,
				message: 'User logged in successfully',
				data: {
					user: {
						_id: user._id,
						username: user.username,
						email: user.email,
						image: user.image?.secure_url,
					},
					accessToken,
				},
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: false,
				message: error.message,
			});
		}
	}
	async fetchProfileHandler(req, res) {
		try {
			const { _id } = req.user;
			const user = await userModel.findById(_id);

			return res.status(StatusCodes.OK).json({
				status: true,
				message: 'User profile fetched successfully',
				data: user,
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: false,
				message: error.message,
			});
		}
	}
	async updateProfileHandler(req, res) {
		try {
			const { username, email, phone } = req.body;
			const { _id } = req.user;
			const profileImageLocalFilePath = req?.file?.path;
			console.log(profileImageLocalFilePath, 'profile');

			// Validation
			if (!email.includes('@')) {
				return res.status(StatusCodes.BAD_REQUEST).json({
					status: false,
					message: 'Invalid email address',
				});
			}

			const user = await userModel.findById({ _id: _id });
			if (!user) {
				return res.status(StatusCodes.NOT_FOUND).json({
					status: false,
					message: 'User not found with this ID',
				});
			}

			if (profileImageLocalFilePath) {
				await cloudinaryUtils.deleteImageOnCloudinary(user?.image?.public_id);
				console.log(`Image deleted from cloudinary: ${user?.image?.public_id}`);
			}

			const { secure_url, public_id } =
				await cloudinaryUtils.uploadImageOnCloudinary(
					profileImageLocalFilePath,
				);

			console.log(`SECURE_URL`, secure_url);
			console.log(`PUBLIC_ID`, public_id);
			user.image.secure_url = secure_url;
			user.image.public_id = public_id;

			if (username) user.username = username || user?.username;
			if (email) user.email = email || user?.email;
			if (phone) user.phone = username || user?.phone;

			return res.status(StatusCodes.OK).json({
				status: true,
				message: 'User profile updated successfully',
				data: {
					user: {
						_id: user._id,
						username: user.username,
						email: user.email,
						phone: user.phone,
						image: user.image?.secure_url,
					},
				},
			});
		} catch (error) {
			return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				status: false,
				message: error.message,
			});
		}
	}
}

export default new AuthController();
