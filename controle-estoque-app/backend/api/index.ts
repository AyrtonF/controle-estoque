import { app } from '../src/infrastructure/app';
import dotenv from 'dotenv';

dotenv.config();

// Para Vercel Serverless - exporta o app sem listen()
export default app;
