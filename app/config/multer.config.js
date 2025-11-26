import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';

const UPLOAD_DIRECTORY = path.join('public', 'uploads');

// Create upload directory if not exists
if (!fs.existsSync(UPLOAD_DIRECTORY)) {
	fs.mkdirSync(UPLOAD_DIRECTORY, { recursive: true });
}

// Allowed mime types
const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/png',
	'image/jpg',
	'image/webp',
	'image/gif',
];
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, UPLOAD_DIRECTORY);
	},
	filename: (_req, file, cb) => {
		const ext = path.extname(file.originalname);
		const base = path.basename(file.originalname, ext);

		const uniqueName = `WebSkitterAcademy_${Date.now()}_${Math.round(
			Math.random() * 1e9,
		)}_${base}${ext}`;

		cb(null, uniqueName);
	},
});

const fileFilter = (req, file, cb) => {
	if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('❌ Invalid file type. Only images allowed.'), false);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024, // 5MB
	},
});

export default upload;
