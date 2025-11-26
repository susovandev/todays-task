import express from 'express';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

export default app;
