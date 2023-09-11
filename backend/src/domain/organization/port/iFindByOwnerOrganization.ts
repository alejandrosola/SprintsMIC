import { User } from 'src/domain/user/model/user.entity';
import { Organization } from '../model/organization.entity';

export interface IfindByOwnerOrganization {
    findByOwner(ownerId: string): Promise<Organization[]>;
}
