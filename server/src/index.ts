import http from 'http';
import { env } from './config/env';
import { app } from './app';
import { connectDB, disconnectDB } from './db/connect';

let server: http.Server | null = null;
let isShuttingDown = false;

const startServer = async (): Promise<void> => {
  try {
    // 1. Attempt MongoDB connection if configured
    if (env.MONGODB_URI && env.MONGODB_URI.trim().length > 0) {
      try {
        await connectDB(env.MONGODB_URI);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown database error';
        console.error(`[Database Error] Could not establish initial MongoDB connection: ${msg}`);
        // If in production, database connectivity might be required
        if (env.NODE_ENV === 'production') {
          process.exit(1);
        }
      }
    } else {
      console.warn(
        '[Database Warning] MONGODB_URI is not configured. Starting API without active database connection.'
      );
    }

    // 2. Start HTTP Server
    server = app.listen(env.PORT, () => {
      console.log(`[Server] Career Compass Backend listening on port ${env.PORT}`);
      console.log(`[Server] Environment: ${env.NODE_ENV}`);
      console.log(`[Server] Allowed Client Origin: ${env.CLIENT_ORIGIN}`);
      console.log(`[Server] Health Endpoint: http://localhost:${env.PORT}/api/health`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server startup error';
    console.error(`[Fatal Server Error] Startup failed: ${message}`);
    process.exit(1);
  }
};

/**
 * Handles graceful shutdown on SIGINT / SIGTERM signals.
 */
const handleShutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);

  const forceTimeout = setTimeout(() => {
    console.error('[Server Error] Graceful shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, 10000);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((err) => {
          if (err) return reject(err);
          console.log('[Server] HTTP server stopped accepting connections.');
          resolve();
        });
      });
    }

    await disconnectDB();
    clearTimeout(forceTimeout);
    console.log('[Server] Graceful shutdown completed cleanly.');
    process.exit(0);
  } catch (err) {
    clearTimeout(forceTimeout);
    console.error('[Server Error] Error encountered during shutdown:', err);
    process.exit(1);
  }
};

// Process-level event listeners for unhandled errors
process.on('uncaughtException', (err: Error) => {
  console.error('[Fatal Error] Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[Fatal Error] Unhandled Promise Rejection:', reason);
  process.exit(1);
});

// Termination signals
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();
