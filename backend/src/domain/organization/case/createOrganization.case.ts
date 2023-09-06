import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { IDocumentRepository } from '../port/IDocumentRepository';

import { iCreateOrganization } from '../port/iCreateOrganization';
import { OrganizationStatus } from '../model/status.enum';
import { Category } from 'src/domain/category/model/category.entity';
import { User } from 'src/domain/user/model/user.entity';
import { MulterFile } from 'multer';
import { MinioService } from '../../../util/minio.service';
import { Document } from '../model/document.entity';

const Minio = new MinioService();

require('dotenv').config();

@Injectable()
export class CreateOrganization implements iCreateOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private organizationRepository: IOrganizationRepository,
		@Inject(IDocumentRepository)
		private documentRepository: IDocumentRepository,
	) {
	}

	async create(
		legalName: string,
		address: string,
		cuit: string,
		categories: Category[],
		subcategories: Category[],
		phone: string,
		owner: User,
		operators: User[],
		supportingDocumentation: MulterFile[],
	): Promise<Organization> {

		const aOrganization = new Organization();
		aOrganization.legalName = legalName
		aOrganization.address = address
		aOrganization.cuit = cuit
		aOrganization.categories = categories;
		aOrganization.subcategories = subcategories
		aOrganization.phone = phone
		aOrganization.owner = owner
		aOrganization.operators = operators
		aOrganization.status = OrganizationStatus.PENDING;

		try {
			const aOrganizationEntity = await this.organizationRepository.create(aOrganization);

			for (const doc of supportingDocumentation) {
				await Minio.verifyBucket(aOrganizationEntity.id, doc);

				const uri = await Minio.createUR(aOrganizationEntity.id, doc.originalname);

				const aDocument = new Document();

				aDocument.name = doc.originalname;
				aDocument.url = uri;
				aDocument.organization = aOrganizationEntity

				await this.documentRepository.create(aDocument);
			}

			return aOrganizationEntity;
		} catch (error) {
			console.log("🚀 ~ file: createOrganization.case.ts:82 ~ CreateOrganization ~ error:", error)
		}
	}
}
