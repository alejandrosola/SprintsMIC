import { Category } from "src/domain/category/model/category.entity";

export class CategoryPayload {
	id: string;
	name: string;
	father: Category;
}
