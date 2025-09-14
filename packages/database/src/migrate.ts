import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/physiotherapy',
});

async function runMigrations() {
    try {
        await client.connect();
        console.log('Connected to database');

        // Read and execute schema files in order
        const schemaFiles = [
            'users.sql',
            'appointments.sql',
            'clinics.sql',
            'payments.sql',
            'ai.sql',
            'notifications.sql'
        ];

        for (const file of schemaFiles) {
            console.log(`Executing ${file}...`);
            const schemaPath = join(__dirname, 'schema', file);
            const schema = readFileSync(schemaPath, 'utf8');

            try {
                await client.query(schema);
                console.log(`✅ ${file} executed successfully`);
            } catch (error: any) {
                // If table already exists, that's okay
                if (error.code === '42P07') {
                    console.log(`⚠️  ${file} - tables already exist, skipping`);
                } else {
                    throw error;
                }
            }
        }

        console.log('🎉 All migrations completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Only run migrations if called directly
if (require.main === module) {
    runMigrations();
}
