import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { IfindByIdOrganization } from '../port/iFindByIdOrganization';

@Injectable()
export class FindByIdOrganization implements IfindByIdOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private readonly organizacionRepository: IOrganizationRepository
	) { }

	async findById(id: string): Promise<Organization> {
		return this.organizacionRepository.findByID(id);
	}
}
