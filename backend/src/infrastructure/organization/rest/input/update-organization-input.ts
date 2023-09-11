import { Category } from 'src/domain/category/model/category.entity';
import { User } from 'src/domain/user/model/user.entity';

export class UpdateOrganizationInput {
	id: string;

	legalName: string;

	address: string;

	cuit: string;

	categories: Category[];

	subcategories: Category[];

	phone: string;

	owner: User;

	operators: User[];

	supportingDocumentation: File[];

	status: string;

	validator: User;

	documentDescriptions: string[];
}
