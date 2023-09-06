import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Category } from '../../category/typeorm/model/category.entity';
import data = require("./json/categorias.json")

export default class CategorySeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        console.log("Seeders Category...")
        const repository = dataSource.getRepository(Category);

        // Función recursiva para crear las categorías y subcategorías
        const createCategories = async (parent: any, categories: any[]) => {
            for (const category of categories) {
                const newCategory = repository.create({
                    name: category.nombre,
                    father: parent,
                });
                await repository.save(newCategory);

                if (category.subcategorias.length > 0) {
                    await createCategories(newCategory, category.subcategorias);
                }
            }
        };

        // Iniciar la creación de categorías y subcategorías desde el archivo JSON
        await createCategories(null, data.categorias);
    }
}