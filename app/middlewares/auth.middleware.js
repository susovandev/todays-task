import { StatusCodes } from 'http-status-codes';
import { verifyJwt } from '../helper/auth.helper.js';

const AuthCheck = (req, res, next) => {
	const accessToken =
		req?.headers['x-access-token'] ||
		req?.headers?.authorization?.split(' ')[1] ||
		req.body?.accessToken ||
		req?.cookies?.accessToken;
	if (!accessToken) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ status: false, message: 'Access token not found' });
	}
	try {
		const decodedToken = verifyJwt(accessToken);
		if (!decodedToken) {
			return res
				.status(StatusCodes.UNAUTHORIZED)
				.json({ status: false, message: 'Invalid access token' });
		}

		req.user = decodedToken;
		next();
	} catch (error) {
		return res
			.status(StatusCodes.UNAUTHORIZED)
			.json({ status: false, message: 'Invalid access token' });
	}
};

export default AuthCheck;
