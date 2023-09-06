import { Controller, Post, Put, Body, Get, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
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

import { CreateDocument } from '../../../../domain/organization/case/createDocument.case';
import { UpdateOrganization } from 'src/domain/organization/case/updateOrgranization.case';
import { UpdateTakeOrganization } from 'src/domain/organization/case/updateTakeOrgranization.case';
import { UpdateDropOrganization } from 'src/domain/organization/case/updateDropOrgranization.case';
import { UpdateStatusOrganizationInput } from '../input/update-status-organization-input';
import { UpdateStatusOrganization } from 'src/domain/organization/case/updateStatusOrgranization.case';

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
		private readonly createDocument: CreateDocument,

	) {
	}

	@Get()
	async findAll(): Promise<OrganizationPayload[]> {
		try {
			const someOrganization: Organization[] = await this.findAllOrganization.findAll();
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
			const aOrganization: Organization = await this.findByIdOrganization.findById(id);
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
		@Body() organization: any,
	) {
		try {
			const aOrganization = await this.createOrganization.create(
				organization.legalName,
				organization.address,
				organization.cuit,
				JSON.parse(organization.categories),
				JSON.parse(organization.subcategories),
				organization.phone,
				JSON.parse(organization.owner),
				JSON.parse(organization.operators),
				supportingDocumentation,
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

	@Put("/take")
	async update(@Body() organization: UpdateTakeOrganizationInput): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization = await this.updateTakeOrganization.update(
				organization.id, organization.validator
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

	@Put("/drop")
	async updateDrop(@Body() organization: UpdateTakeOrganizationInput): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization = await this.updateDropOrganization.update(
				organization.id
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

	@Put("/status")
	async updateStatus(@Body() organization: UpdateStatusOrganizationInput): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization = await this.updateStatusOrganization.update(
				organization.id, organization.status, organization.body
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

}