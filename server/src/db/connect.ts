import mongoose from 'mongoose';
import { validateMongoUri } from '../config/env';

/**
 * Returns human-readable status of the current Mongoose connection.
 */
export const getDbStatus = (): 'connected' | 'connecting' | 'disconnecting' | 'disconnected' => {
  switch (mongoose.connection.readyState) {
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
};

/**
 * Checks if the database is in a connected state.
 */
export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

/**
 * Connects to MongoDB using Mongoose.
 * Validates the URI and logs safe connection diagnostics (omitting credentials).
 */
export const connectDB = async (uri: string): Promise<void> => {
  try {
    const validatedUri = validateMongoUri(uri);

    // Set strictQuery for modern Mongoose schema adherence
    mongoose.set('strictQuery', true);

    console.log('[Database] Connecting to MongoDB...');
    await mongoose.connect(validatedUri);

    const host = mongoose.connection.host || 'unknown';
    const dbName = mongoose.connection.name || 'default';
    console.log(`[Database] MongoDB connected successfully to database: "${dbName}" on host: "${host}"`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database connection error';
    console.error(`[Database Error] Failed to connect to MongoDB: ${message}`);
    throw error;
  }
};

/**
 * Gracefully closes the MongoDB connection.
 */
export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    try {
      console.log('[Database] Closing MongoDB connection...');
      await mongoose.disconnect();
      console.log('[Database] MongoDB connection closed.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error during disconnect';
      console.error(`[Database Error] Error closing MongoDB connection: ${message}`);
    }
  }
};
