import { User } from 'src/domain/user/model/user.entity';
import { Organization } from '../model/organization.entity';

export interface IfindByOperatorOrganization {
    findByOperator(operatorId: string): Promise<Organization[]>;
}
