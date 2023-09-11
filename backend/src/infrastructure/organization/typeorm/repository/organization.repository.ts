import { Not, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Organization as TypeORMOrganization } from 'src/infrastructure/organization/typeorm/model/organization.entity';
import { IOrganizationRepository } from 'src/domain/organization/port/iOrganizationRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization as DomainOrganization } from 'src/domain/organization/model/organization.entity';
import { OrganizationMapper } from '../mapper/organization-typeorm.mapper';
import { OrganizationStatus } from 'src/domain/organization/model/status.enum';

@Injectable()
export class OrganizationRepository implements IOrganizationRepository {
	constructor(
		@InjectRepository(TypeORMOrganization)
		private readonly organizationRepository: Repository<TypeORMOrganization>
	) {}

	async findByOwner(ownerId: string): Promise<DomainOrganization[]> {
		const organizations = await this.organizationRepository.find({
			where: {
				owner: { id: ownerId },
				status: Not(OrganizationStatus.DELETED),
			}, // Cambio en la condición de búsqueda
			relations: [
				'owner',
				'operators',
				'categories',
				'subcategories',
				'validator',
				'supportingDocumentation',
			],
		});

		return organizations.map((organization) =>
			OrganizationMapper.toDomain(organization)
		);
	}

	async findByOperator(operatorId: string): Promise<DomainOrganization[]> {
		const organizations = await this.organizationRepository
			.createQueryBuilder('organization')
			.leftJoinAndSelect('organization.operators', 'operator')
			.where('operator.id = :opId', {
				opId: operatorId,
				status: Not(OrganizationStatus.DELETED),
			})
			.leftJoinAndSelect('organization.categories', 'categories')
			.leftJoinAndSelect('organization.subcategories', 'subcategories')
			.leftJoinAndSelect('organization.validator', 'validator')
			.leftJoinAndSelect(
				'organization.supportingDocumentation',
				'supportingDocumentation'
			)
			.getMany();

		return organizations.map((organization) =>
			OrganizationMapper.toDomain(organization)
		);
	}

	async findAll(): Promise<DomainOrganization[]> {
		const organizations = await this.organizationRepository.find({
			relations: [
				'owner',
				'operators',
				'categories',
				'subcategories',
				'validator',
				'supportingDocumentation',
			],
			where: { status: Not(OrganizationStatus.DELETED) },
		});
		return organizations.map((organization) =>
			OrganizationMapper.toDomain(organization)
		);
	}

	async findByID(id: string): Promise<DomainOrganization> {
		const organization = await this.organizationRepository.findOne({
			where: { id: id, status: Not(OrganizationStatus.DELETED) },
			relations: [
				'owner',
				'operators',
				'categories',
				'subcategories',
				'validator',
				'supportingDocumentation',
			],
		});
		return organization ? OrganizationMapper.toDomain(organization) : null;
	}

	async update(aOrganization: DomainOrganization): Promise<DomainOrganization> {
		const typeORMOrganization = OrganizationMapper.toTypeORM(aOrganization);
		const updatedOrganization = await this.organizationRepository.save(
			typeORMOrganization
		);
		return OrganizationMapper.toDomain(updatedOrganization);
	}

	async create(aOrganization: DomainOrganization): Promise<DomainOrganization> {
		const typeORMOrganization = OrganizationMapper.toTypeORM(aOrganization);
		const savedOrganization = await this.organizationRepository.save(
			typeORMOrganization
		);
		return OrganizationMapper.toDomain(savedOrganization);
	}
}
