import { Client } from 'pg';

async function dropTables() {
    const client = new Client({
        host: 'localhost',
        database: 'mic',
        user: 'postgres',
        password: 'postgres',
        port: 5432,
    });

    const tableNames = [
        'place_accessibilities',
        'place_services',
        'accessibilities',
        'services',
        'place_categories',
        'place_photos',
        'place_schedules',
        'places',
        'days_of_weeks',
        'user_roles',
        'roles',
        'organization_users',
        'organization_categories',
        'organization_subcategories',
        'documents',
        'categories',
        'organizations',
        'users',
        'faq',
        'migrations',
        'password_tokens'
    ];

    try {
        await client.connect();

        for (const tableName of tableNames) {
            await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
            console.log(`Table ${tableName} dropped successfully`);
        }

        console.log('All tables dropped successfully');
    } catch (error) {
        console.error('Error dropping tables:', error);
    } finally {
        await client.end();
    }
}

dropTables();
