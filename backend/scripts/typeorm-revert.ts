// "migrate:uundo": "node ./scripts/typeorm-revert.ts"
const { createConnection, MigrationExecutor } = require("typeorm");
const path = require("path");
const dotenv = require("dotenv");

// Obtén la ruta absoluta al archivo .env
const envFilePath = path.resolve(__dirname, "../env");

// Carga las variables de entorno desde el archivo .env
dotenv.config({ path: envFilePath });

(async () => {
    const connection = await createConnection({
        type: 'postgres',
        host: 'localhost', // Usa process.env para acceder a las variables de entorno
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'mic',
        entities: [__dirname + '/../**/infrastructure/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../**/migrations/*.ts'],
        migrationsTableName: "migrations",
        logging: true
        // ... otras opciones de configuración ...
    });


    const migrationExecutor = new MigrationExecutor(connection);
    const migrations = await migrationExecutor.getMigrations();
    console.log(migrations)
    for (let migration of migrations) {
        await migrationExecutor.undoLastMigration();
    }

    await connection.close();
})();
