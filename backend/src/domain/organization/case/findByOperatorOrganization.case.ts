import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { IfindByIdOrganization } from '../port/iFindByIdOrganization';
import { IfindByOperatorOrganization } from '../port/iFindByOperatorOrganization';

@Injectable()
export class FindByOperatorOrganization implements IfindByOperatorOrganization {
    constructor(
        @Inject(IOrganizationRepository)
        private readonly organizacionRepository: IOrganizationRepository
    ) { }

    async findByOperator(operatorId: string): Promise<Organization[]> {
        return this.organizacionRepository.findByOperator(operatorId);
    }
}
