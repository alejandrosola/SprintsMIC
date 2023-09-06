import { Organization as TypeORMOrganization } from '../model/organization.entity';
import { Organization as DomainOrganization } from '../../../../domain/organization/model/organization.entity';

export class OrganizationMapper {
    static toDomain(organization: TypeORMOrganization): DomainOrganization {
        return {
            id: organization.id,
            legalName: organization.legalName,
            address: organization.address,
            cuit: organization.cuit,
            categories: organization.categories,
            subcategories: organization.subcategories,
            phone: organization.phone,
            owner: organization.owner,
            operators: organization.operators,
            supportingDocumentation: organization.supportingDocumentation,
            status: organization.status,
            validator: organization.validator,
            createdAt: organization.createdAt,
            updatedAt: organization.updatedAt,
            deletedAt: organization.deletedAt || null,
        };
    }

    static toTypeORM(domainOrganization: DomainOrganization): TypeORMOrganization {
        const typeORMOrganization = new TypeORMOrganization();
        typeORMOrganization.id = domainOrganization.id;
        typeORMOrganization.legalName = domainOrganization.legalName;
        typeORMOrganization.address = domainOrganization.address;
        typeORMOrganization.cuit = domainOrganization.cuit;
        typeORMOrganization.categories = domainOrganization.categories;
        typeORMOrganization.subcategories = domainOrganization.subcategories;
        typeORMOrganization.phone = domainOrganization.phone;
        typeORMOrganization.owner = domainOrganization.owner;
        typeORMOrganization.operators = domainOrganization.operators;
        typeORMOrganization.supportingDocumentation = domainOrganization.supportingDocumentation;
        typeORMOrganization.status = domainOrganization.status;
        typeORMOrganization.validator = domainOrganization.validator;
        typeORMOrganization.createdAt = domainOrganization.createdAt;
        typeORMOrganization.updatedAt = domainOrganization.updatedAt;
        typeORMOrganization.deletedAt = domainOrganization.deletedAt || null;

        return typeORMOrganization;
    }
}