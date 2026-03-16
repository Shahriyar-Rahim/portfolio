import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './configs/database.config.js';
import dns from 'dns'
import rateLimit from 'express-rate-limit'
import userRoutes from './routes/user.routes.js';
import commentRoutes from './routes/comment.route.js';
import educationRoutes from './routes/education.routes.js';
import experienceRoutes from './routes/experience.routes.js';
import fileRoutes from './routes/file.routes.js'
import inboxRoutes from './routes/inbox.routes.js'
import serviceRoutes from './routes/service.route.js'
import testimonialRoutes from './routes/testimonial.routes.js'
import { authLimiter, generalLimiter } from './middlewares/rateLimiter.js';

dns.setServers(['8.8.8.8', '1.1.1.1'])

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/v1/auth', authLimiter ,userRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use('/api/v1/me', educationRoutes);
app.use('/api/v1/me/experience', experienceRoutes);
app.use('/api/v1/file', fileRoutes);
app.use('/api/v1/inbox', generalLimiter , inboxRoutes);
app.use('/api/v1/service', serviceRoutes);
app.use('/api/v1/testimonial', testimonialRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));