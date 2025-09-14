import { createPostgresClient, createRedisClient } from '@physiotherapy/database';
import { Client } from 'pg';
import { createClient as createRedisClientType } from 'redis';

// Database connection pool
let pgClient: Client | null = null;
let redisClient: ReturnType<typeof createRedisClientType> | null = null;

export const getPostgresClient = async (): Promise<Client> => {
    if (!pgClient) {
        pgClient = createPostgresClient();
        await pgClient.connect();
    }
    return pgClient;
};

export const getRedisClient = async () => {
    if (!redisClient) {
        redisClient = createRedisClient();
        await redisClient.connect();
    }
    return redisClient;
};

export const closeConnections = async () => {
    if (pgClient) {
        await pgClient.end();
        pgClient = null;
    }
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
    }
};

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing database connections...');
    await closeConnections();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Closing database connections...');
    await closeConnections();
    process.exit(0);
});
