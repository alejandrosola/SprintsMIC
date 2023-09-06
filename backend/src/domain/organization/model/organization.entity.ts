import { Category } from '../../category/model/category.entity';
import { User } from '../../user/model/user.entity';
import { Document } from './document.entity';

export class Organization {
	id: string;

	legalName: string;

	address: string;

	cuit: string;

	categories: Category[];

	subcategories: Category[];

	phone: string;

	owner: User;

	operators: User[];

	supportingDocumentation: Document[];

	status: string;

	validator: User;

	createdAt: Date;

	updatedAt: Date;

	deletedAt: Date;
}

