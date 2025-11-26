import bcrypt from 'bcryptjs';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';

export const hashPassword = (password) => {
	const genSalt = bcrypt.genSaltSync(10);
	const hashPassword = bcrypt.hashSync(password, genSalt);
	return hashPassword;
};

export const comparePassword = (currentPassword, hashPassword) => {
	return bcrypt.compareSync(currentPassword, hasPassword);
};

export const signAccessToken = (user) => {
	const accessToken = jwt.sign(
		{
			_id: user._id,
			username: user.username,
			email: user.email,
		},
		config.ACCESS_TOKEN_SECRET,
		{
			expiresIn: config.ACCESS_TOKEN_EXPIRES_IN,
		},
	);

	return accessToken;
};

export const verifyJwt = (token) => {
	return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
