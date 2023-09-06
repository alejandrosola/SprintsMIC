import { Client } from 'pg';

async function clearTables() {
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
    ];

    try {
        await client.connect();

        for (const tableName of tableNames) {
            await client.query(`DELETE FROM ${tableName}`);
            console.log(`Table ${tableName} cleared successfully`);
        }

        console.log('All tables cleared successfully');
    } catch (error) {
        console.error('Error clearing tables:', error);
    } finally {
        await client.end();
    }
}

clearTables();
