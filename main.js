import app from './app/app.js';
import config from './app/config/config.js';
import connectDB from './app/config/db.config.js';

const port = config.PORT || 5000;

connectDB()
	.then(() => {
		app.listen(port, () => console.log(`Server running on port ${port}`));
	})
	.catch((error) => {
		console.error(`MONGODB CONNECTION FAILED:`, error);
		process.exit(1);
	});
