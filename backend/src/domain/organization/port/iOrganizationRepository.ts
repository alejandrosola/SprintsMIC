import { User } from 'src/domain/user/model/user.entity';
import { Organization } from '../model/organization.entity';

export interface IOrganizationRepository {
	findAll(): Promise<Organization[]>;
	findByID(id: string): Promise<Organization>;
	create(aOrganization: Organization): Promise<Organization>;
	update(aOrganization: Organization): Promise<Organization>;
	findByOwner(ownerId: string): Promise<Organization[]>;
	findByOperator(ownerId: string): Promise<Organization[]>;

}

export const IOrganizationRepository = Symbol('IOrganizationRepository');
