import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from '../src/presentation/routes';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', router);

// Para Vercel Serverless - exporta o app sem listen()
export default app;
