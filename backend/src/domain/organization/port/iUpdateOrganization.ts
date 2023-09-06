import { Category } from 'src/domain/category/model/category.entity';
import { Organization } from '../model/organization.entity';
import { User } from 'src/domain/user/model/user.entity';
import { Document } from '../model/document.entity';

export interface iUpdateOrganization {
    update(
        id: string,
        legalName: string,
        address: string,
        cuit: string,
        categories: Category[],
        subcategories: Category[],
        phone: string,
        owner: User,
        operators: User[],
        supportingDocumentation: Document[],
        status: string,
        validator: User
    ): Promise<Organization>;
}