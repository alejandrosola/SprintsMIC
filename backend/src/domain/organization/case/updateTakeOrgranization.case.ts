import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { User } from 'src/domain/user/model/user.entity';
import { iUpdateTakeOrganization } from '../port/iUpdateTakeOrganization';
import { OrganizationStatus } from '../model/status.enum';

@Injectable()
export class UpdateTakeOrganization implements iUpdateTakeOrganization {
    constructor(
        @Inject(IOrganizationRepository)
        private organizationRepository: IOrganizationRepository,
    ) { }

    async update(
        id: string,
        validator: User
    ): Promise<Organization> {
        const organizationSearched = await this.organizationRepository.findByID(id);

        if (!organizationSearched) {
            throw new Error('Organizacion inexistente');
        }
        organizationSearched.status = OrganizationStatus.IN_REVIEW
        organizationSearched.validator = validator

        const organizationUpdated = await this.organizationRepository.update(organizationSearched);
        return organizationUpdated;
    }
}
