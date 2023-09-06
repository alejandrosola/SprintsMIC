import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class OrganizationSubcategories1692220630759 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'organization_subcategories',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: `uuid_generate_v4()`,
                    },
                    {
                        name: 'organization_id',
                        type: 'uuid',
                    },
                    {
                        name: 'category_id',
                        type: 'uuid',
                    }
                ]
            }),
            true
        )

        await queryRunner.createForeignKey(
            'organization_subcategories',
            new TableForeignKey({
                columnNames: ['organization_id'],
                referencedTableName: 'organizations',
                referencedColumnNames: ['id'],
            })
        );

        await queryRunner.createForeignKey(
            'organization_subcategories',
            new TableForeignKey({
                columnNames: ['category_id'],
                referencedTableName: 'categories',
                referencedColumnNames: ['id'],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(`organization_subcategories`);
    }

}