import { Category } from '../model/category.entity';

export interface ICategoryRepository {
	findAll(): Promise<Category[]>;
	findByID(id: string): Promise<Category>;
	findByFather(father: Category | null): Promise<Category[]>;
	create(aCategory: Category): Promise<Category>;
	update(aCategory: Category): Promise<Category>;
}

export const ICategoryRepository = Symbol('ICategoryRepository');
