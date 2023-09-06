import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Organization as TypeORMOrganization } from 'src/infrastructure/organization/typeorm/model/organization.entity';
import { IOrganizationRepository } from 'src/domain/organization/port/iOrganizationRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization as DomainOrganization } from 'src/domain/organization/model/organization.entity';
import { OrganizationMapper } from '../mapper/organization-typeorm.mapper';

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
	constructor(
		@InjectRepository(TypeORMOrganization)
		private readonly organizationRepository: Repository<TypeORMOrganization>
	) { }

	async findAll(): Promise<DomainOrganization[]> {
		const organizations = await this.organizationRepository.find({
			relations: ['owner', 'operators', 'categories', 'subcategories', 'validator', 'supportingDocumentation']
		});
		return organizations.map(organization => OrganizationMapper.toDomain(organization));
	}

	async findByID(id: string): Promise<DomainOrganization> {
		const organization = await this.organizationRepository.findOne({ where: { id: id }, relations: ['owner', 'operators', 'categories', 'subcategories', 'validator', 'supportingDocumentation'] });
		return organization ? OrganizationMapper.toDomain(organization) : null;
	}

	async update(aOrganization: DomainOrganization): Promise<DomainOrganization> {
		const typeORMOrganization = OrganizationMapper.toTypeORM(aOrganization);
		const updatedOrganization = await this.organizationRepository.save(typeORMOrganization);
		return OrganizationMapper.toDomain(updatedOrganization);
	}

	async create(aOrganization: DomainOrganization): Promise<DomainOrganization> {
		const typeORMOrganization = OrganizationMapper.toTypeORM(aOrganization);
		const savedOrganization = await this.organizationRepository.save(typeORMOrganization);
		return OrganizationMapper.toDomain(savedOrganization);
	}
}
