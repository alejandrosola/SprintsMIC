import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { iUpdateStatusOrganization } from '../port/iUpdateStatusOrganization';

import { EmailService } from '../../../util/email.service';
import { OrganizationStatus } from '../model/status.enum';
const Email = new EmailService();

@Injectable()
export class UpdateStatusOrganization implements iUpdateStatusOrganization {
    constructor(
        @Inject(IOrganizationRepository)
        private organizationRepository: IOrganizationRepository,
    ) { }

    async update(
        id: string,
        status: string,
        body: string
    ): Promise<Organization> {
        console.log("🚀 ~ file: updateStatusOrgranization.case.ts:21 ~ UpdateStatusOrganization ~ status:", status)
        const organizationSearched = await this.organizationRepository.findByID(id);

        if (!organizationSearched) {
            throw new Error('Organizacion inexistente');
        }
        organizationSearched.status = status

        const organizationUpdated = await this.organizationRepository.update(organizationSearched);
        console.log("🚀 ~ file: updateStatusOrgranization.case.ts:30 ~ UpdateStatusOrganization ~ organizationUpdated:", organizationUpdated)

        if (status !== OrganizationStatus.ON_HOLD) {
            await Email.sendInfo(organizationSearched.owner.email, body);
        }

        return organizationUpdated;
    }
}
