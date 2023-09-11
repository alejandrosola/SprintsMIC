import {
	Controller,
	Post,
	Put,
	Body,
	Get,
	Param,
	UseInterceptors,
	UploadedFiles,
	Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';

import { Organization } from '../../../../domain/organization/model/organization.entity';
import { OrganizationRestMapper } from '../mapper/organization-rest-mapper';
import { OrganizationPayload } from '../payload/organization-payload';
import { UpdateTakeOrganizationInput } from '../input/update-take-organization-input';

import { responseJson } from 'src/util/responseMessage';

import { CreateOrganization } from '../../../../domain/organization/case/createOrganization.case';
import { FindByIdOrganization } from '../../../../domain/organization/case/findByIdOrganizations.case';
import { FindAllOrganization } from '../../../../domain/organization/case/findAllOrganizations.case';

import { UpdateOrganization } from 'src/domain/organization/case/updateOrganization.case';
import { UpdateTakeOrganization } from 'src/domain/organization/case/updateTakeOrgranization.case';
import { UpdateDropOrganization } from 'src/domain/organization/case/updateDropOrgranization.case';
import { UpdateStatusOrganizationInput } from '../input/update-status-organization-input';
import { UpdateStatusOrganization } from 'src/domain/organization/case/updateStatusOrgranization.case';
import { FindByOwnerOrganization } from 'src/domain/organization/case/findByOwnerOrganization.case';
import { FindByOperatorOrganization } from 'src/domain/organization/case/findByOperatorOrganization.case';

import { CreateOrganizationInput } from '../input/create-organization-input';
import { UpdateOrganizationInput } from '../input/update-organization-input';
import { DeleteOrganization } from 'src/domain/organization/case/deleteOrganization.case';

require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

@Controller('organizations')
export class OrganizationController {
	constructor(
		private readonly createOrganization: CreateOrganization,
		private readonly updateOrganization: UpdateOrganization,
		private readonly updateTakeOrganization: UpdateTakeOrganization,
		private readonly updateDropOrganization: UpdateDropOrganization,
		private readonly updateStatusOrganization: UpdateStatusOrganization,
		private readonly findByIdOrganization: FindByIdOrganization,
		private readonly findAllOrganization: FindAllOrganization,
		private readonly findByOwnerOrganization: FindByOwnerOrganization,
		private readonly findByOperatorOrganization: FindByOperatorOrganization,
		private readonly deleteOrganization: DeleteOrganization
	) { }

	@Get()
	async findAll(): Promise<OrganizationPayload[]> {
		try {
			const someOrganization: Organization[] =
				await this.findAllOrganization.findAll();
			return responseJson(
				200,
				'Organizaciones recuperadas con exito',
				someOrganization.map((aOrganization) => {
					return OrganizationRestMapper.toPayload(aOrganization);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/byOwner/:ownerId')
	async findByOwner(
		@Param('ownerId') ownerId: string
	): Promise<OrganizationPayload[]> {
		try {
			const someOrganization: Organization[] =
				await this.findByOwnerOrganization.findByOwner(ownerId);
			return responseJson(
				200,
				'Organizaciones recuperadas con exito',
				someOrganization.map((aOrganization) => {
					return OrganizationRestMapper.toPayload(aOrganization);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/byOperator/:operatorId')
	async findByOperator(
		@Param('operatorId') operatorId: string
	): Promise<OrganizationPayload[]> {
		try {
			const someOrganization: Organization[] =
				await this.findByOperatorOrganization.findByOperator(operatorId);
			return responseJson(
				200,
				'Organizaciones recuperadas con exito',
				someOrganization.map((aOrganization) => {
					return OrganizationRestMapper.toPayload(aOrganization);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/:id')
	async findByMail(@Param('id') id: string): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization =
				await this.findByIdOrganization.findById(id);
			return responseJson(
				200,
				'Organizacion recuperada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post()
	@UseInterceptors(FilesInterceptor('supportingDocumentation'))
	async submitData(
		@UploadedFiles() supportingDocumentation: MulterFile[],
		@Body() organization: CreateOrganizationInput
	) {
		try {
			const aOrganization = await this.createOrganization.create(
				organization.legalName,
				organization.address,
				organization.cuit,
				organization.categories,
				organization.subcategories,
				organization.phone,
				organization.owner,
				organization.operators,
				supportingDocumentation,
				organization.validator,
				organization.documentDescriptions
			);

			return responseJson(
				200,
				'Organizacion creada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put()
	async update(
		@Body() organization: UpdateOrganizationInput
	): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization = await this.updateOrganization.update(
				organization.id,
				organization.legalName,
				organization.address,
				organization.cuit,
				organization.categories,
				organization.subcategories,
				organization.phone,
				organization.owner,
				organization.operators,
				organization.supportingDocumentation,
				organization.status,
				organization.validator
			);

			return responseJson(
				200,
				'Organizacion actualizada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/take')
	async updateTake(
		@Body() organization: UpdateTakeOrganizationInput
	): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization =
				await this.updateTakeOrganization.update(
					organization.id,
					organization.validator
				);

			return responseJson(
				200,
				'Organizacion actualizada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/drop')
	async updateDrop(
		@Body() organization: UpdateTakeOrganizationInput
	): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization =
				await this.updateDropOrganization.update(organization.id);

			return responseJson(
				200,
				'Organizacion actualizada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/status')
	async updateStatus(
		@Body() organization: UpdateStatusOrganizationInput
	): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization =
				await this.updateStatusOrganization.update(
					organization.id,
					organization.status,
					organization.body
				);

			return responseJson(
				200,
				'Organizacion actualizada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Delete('/id/:id')
	async delete(@Param('id') id: string): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization = await this.deleteOrganization.delete(
				id
			);
			return aOrganization
				? responseJson(
					200,
					'Organizacion eliminada con exito',
					OrganizationRestMapper.toPayload(aOrganization)
				)
				: responseJson(500, 'No existe un espacio con ese id');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}
}
