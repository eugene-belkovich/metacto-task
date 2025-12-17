import mongoose from 'mongoose';
import { env } from './env';
import logger from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to MongoDB');
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error({ err: error }, 'Failed to disconnect from MongoDB');
    throw error;
  }
};

mongoose.connection.on('error', (error) => {
  logger.error({ err: error }, 'MongoDB connection error');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});
