// Database package exports
export * from './migrate';
export * from './seed';

// Database connection utilities
import { Client } from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL client
export const createPostgresClient = () => {
    return new Client({
        connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/physiotherapy',
    });
};

// Redis client
export const createRedisClient = () => {
    return createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
};

// Database health check
export const checkDatabaseHealth = async () => {
    const pgClient = createPostgresClient();
    const redisClient = createRedisClient();

    try {
        await pgClient.connect();
        await redisClient.connect();

        // Test PostgreSQL
        await pgClient.query('SELECT 1');
        console.log('✅ PostgreSQL connection successful');

        // Test Redis
        await redisClient.ping();
        console.log('✅ Redis connection successful');

        return { postgres: true, redis: true };
    } catch (error) {
        console.error('❌ Database health check failed:', error);
        return { postgres: false, redis: false };
    } finally {
        await pgClient.end();
        await redisClient.quit();
    }
};
