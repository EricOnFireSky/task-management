import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/task-manager',
  nodeEnv: process.env.NODE_ENV || 'development',
};