import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { IfindByIdOrganization } from '../port/iFindByIdOrganization';
import { IfindByOwnerOrganization } from '../port/iFindByOwnerOrganization';

@Injectable()
export class FindByOwnerOrganization implements IfindByOwnerOrganization {
    constructor(
        @Inject(IOrganizationRepository)
        private readonly organizacionRepository: IOrganizationRepository
    ) { }

    async findByOwner(ownerId: string): Promise<Organization[]> {
        return this.organizacionRepository.findByOwner(ownerId);
    }
}
