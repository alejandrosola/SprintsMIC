import { Category } from 'src/domain/category/model/category.entity';
import { Organization } from '../model/organization.entity';
import { User } from 'src/domain/user/model/user.entity';
import { MulterFile } from 'multer';

export interface iCreateOrganization {
	create(
		legalName: string,
		address: string,
		cuit: string,
		categories: Category[],
		subcategories: Category[],
		phone: string,
		owner: User,
		operators: User[],
		supportingDocumentation: MulterFile[],
		validator: User,
	): Promise<Organization>;
}
