import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { IfindAllOrganization } from '../port/iFindAllOrganization';

@Injectable()
export class FindAllOrganization implements IfindAllOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private readonly organizacionRepository: IOrganizationRepository
	) { }

	async findAll(): Promise<Organization[]> {
		return this.organizacionRepository.findAll();
	}

}
