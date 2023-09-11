import { Document } from 'src/domain/organization/model/document.entity';
import { UserPayload } from 'src/infrastructure/user/rest/payload/user-payload';
import { CategoryPayload } from 'src/infrastructure/category/rest/payload/category-payload';

export class OrganizationPayload {
	id: string;

	legalName: string;

	address: string;

	cuit: string;

	categories: CategoryPayload[];

	subcategories: CategoryPayload[];

	phone: string;

	owner: UserPayload;

	operators: UserPayload[];

	supportingDocumentation: Document[];

	status: string;

	validator: UserPayload;

	updatedAt: Date;
	createdAt: Date;
}
