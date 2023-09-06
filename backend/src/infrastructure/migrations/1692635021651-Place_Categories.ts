import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class PlaceCategories1692635021651 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'place_categories',
				columns: [
					{
						name: 'id',
						type: 'uuid',
						isPrimary: true,
						default: `uuid_generate_v4()`,
					},
					{
						name: 'placeId',
						type: 'uuid',
						isNullable: false,
					},
					{
						name: 'categoryId',
						type: 'uuid',
						isNullable: false,
					},
				],
			}),
			true
		);

		await queryRunner.createForeignKey(
			'place_categories',
			new TableForeignKey({
				columnNames: ['placeId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'places',
				onDelete: 'CASCADE',
			})
		);

		await queryRunner.createForeignKey(
			'place_categories',
			new TableForeignKey({
				columnNames: ['categoryId'],
				referencedColumnNames: ['id'],
				referencedTableName: 'categories',
				onDelete: 'CASCADE',
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('place_categories');
	}
}
