const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

async function testRedis() {
    try {
        console.log('Testing Redis connection...');
        console.log('REDIS_URL:', process.env.REDIS_URL);

        await client.connect();
        console.log('✅ Connected to Redis');

        await client.ping();
        console.log('✅ Redis ping successful');

        await client.quit();
        console.log('✅ Redis connection closed');
    } catch (error) {
        console.error('❌ Redis connection failed:', error.message);
        process.exit(1);
    }
}

testRedis();
