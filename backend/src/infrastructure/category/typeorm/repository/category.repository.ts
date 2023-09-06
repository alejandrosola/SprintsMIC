import { IsNull, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Category as TypeORMCategory } from 'src/infrastructure/category/typeorm/model/category.entity';
import { Category as DomainCategory } from 'src/domain/category/model/category.entity';
import { ICategoryRepository } from 'src/domain/category/port/iCategoryRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryMapper } from '../mapper/category.typeorm.mapper';  // Asegúrate de importar la ubicación correcta

@Injectable()
export class CategoryRepository implements ICategoryRepository {
	constructor(
		@InjectRepository(TypeORMCategory)
		private readonly categoryRepository: Repository<TypeORMCategory>
	) { }

	async findAll(): Promise<DomainCategory[]> {
		const categories = await this.categoryRepository.find();
		return categories.map(category => CategoryMapper.toDomain(category));
	}

	async findByID(id: string): Promise<DomainCategory> {
		const category = await this.categoryRepository.findOne({ where: { id: id } });
		return category ? CategoryMapper.toDomain(category) : null;
	}

	async findByFather(father: DomainCategory | null): Promise<DomainCategory[]> {
		if (father === null) {
			const categories = await this.categoryRepository.find({ where: { father: IsNull() } });
			return categories.map(category => CategoryMapper.toDomain(category));
		} else {
			const categories = await this.categoryRepository.find({ where: { father: father } });
			return categories.map(category => CategoryMapper.toDomain(category));
		}
	}

	async create(aCategory: DomainCategory): Promise<DomainCategory> {
		const typeORMCategory = CategoryMapper.toTypeORM(aCategory);
		const savedCategory = await this.categoryRepository.save(typeORMCategory);
		return CategoryMapper.toDomain(savedCategory);
	}

	async update(aCategory: DomainCategory): Promise<DomainCategory> {
		const typeORMCategory = CategoryMapper.toTypeORM(aCategory);
		const savedCategory = await this.categoryRepository.save(typeORMCategory);
		return CategoryMapper.toDomain(savedCategory);
	}
}
