import { Category } from "src/domain/category/model/category.entity";
import { User } from "src/domain/user/model/user.entity";
import { Document } from "src/domain/organization/model/document.entity";

export class OrganizationPayload {
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

	updatedAt: Date
}
