import { Controller, Get, Post, Body } from '@nestjs/common';
import { FindAllCategory } from '../../../../domain/category/case/findAllCategory.case';
import { FindCategoryByFather } from '../../../../domain/category/case/findCategoryByFather.case';
import { Category } from '../../../../domain/category/model/category.entity';
import { CategoryRestMapper } from '../mapper/category-rest-mapper';
import { CategoryPayload } from '../payload/category-payload';
import { responseJson } from 'src/util/responseMessage';
import { CategoryInput } from '../input/category-input';

@Controller('categories')
export class CategoryController {
	constructor(
		private readonly findAllCategory: FindAllCategory,
		private readonly findCategorybyFather: FindCategoryByFather,

	) { }

	@Get()
	async findAll(): Promise<CategoryPayload[]> {
		try {
			const someCategory: Category[] = await this.findAllCategory.findAll();
			return responseJson(
				200,
				'Categorias recuperadas con exito',
				someCategory.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('father')
	async login(@Body() father: CategoryInput): Promise<CategoryPayload> {
		try {
			let aCategory: Category[]

			if (Object.keys(father).length === 0) {
				aCategory = await this.findCategorybyFather.findByFather(null);
			} else {
				aCategory = await this.findCategorybyFather.findByFather(father);
			}

			return responseJson(
				200,
				'Categorias recuperadas con exito',
				aCategory.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				}));
		} catch (error) {
			return responseJson(500, error.message);
		}
	}


}
