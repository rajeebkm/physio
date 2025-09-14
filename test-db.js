const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/physiotherapy',
});

async function testConnection() {
    try {
        console.log('Testing database connection...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL);

        await client.connect();
        console.log('✅ Connected to PostgreSQL');

        const result = await client.query('SELECT 1 as test');
        console.log('✅ Query successful:', result.rows[0]);

        await client.end();
        console.log('✅ Connection closed');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
