import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { IDocumentRepository } from '../port/IDocumentRepository';
import { CreateDocument } from './createDocument.case';

import { MinioService } from '../../../util/minio.service';
import { Category } from 'src/domain/category/model/category.entity';
import { User } from 'src/domain/user/model/user.entity';
import { Document } from '../model/document.entity';
import { OrganizationStatus } from '../model/status.enum';
import { iUpdateOrganization } from '../port/iUpdateOrganization';
import { validateChangesByStatus } from './validation';
import { MulterFile } from 'multer';

const Minio = new MinioService();

@Injectable()
export class UpdateOrganization implements iUpdateOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private organizationRepository: IOrganizationRepository,
		@Inject(IDocumentRepository)
		private documentRepository: IDocumentRepository,
		private createDocument: CreateDocument
	) {}

	async update(
		id: string,
		legalName: string,
		address: string,
		cuit: string,
		categories: Category[],
		subcategories: Category[],
		phone: string,
		owner: User,
		operators: User[],
		supportingDocumentation: MulterFile[],
		status: string,
		validator: User
	): Promise<Organization> {
		console.log('ID DEL FRONT', id);
		const organizationSearched = await this.organizationRepository.findByID(id);
		console.log(organizationSearched);
		/* const statusMap: { [key in string]: OrganizationStatus } = {
			['Pendiente']: OrganizationStatus.PENDING,
			['Activo']: OrganizationStatus.ACTIVE,
			['Rechazado']: OrganizationStatus.REJECTED,
			['En revisión']: OrganizationStatus.IN_REVIEW,
			['En espera']: OrganizationStatus.ON_HOLD,
			['Cancelado']: OrganizationStatus.CANCELLED,
		}; */

		status = organizationSearched.status;
		validateChangesByStatus(
			organizationSearched,
			legalName,
			cuit,
			owner,
			supportingDocumentation,
			status,
			validator
		);

		organizationSearched.legalName = legalName;
		organizationSearched.address = address;
		organizationSearched.cuit = cuit;
		organizationSearched.categories = categories;
		organizationSearched.subcategories = subcategories;
		organizationSearched.phone = phone;
		organizationSearched.owner = owner;
		organizationSearched.operators = operators;
		organizationSearched.supportingDocumentation = supportingDocumentation;
		organizationSearched.status = status;
		organizationSearched.validator = validator;

		if (
			status === OrganizationStatus.REJECTED ||
			status === OrganizationStatus.ON_HOLD
		) {
			if (supportingDocumentation) {
				const documents = await this.documentRepository.findByOrganization(
					organizationSearched
				);
				documents.map(async (doc) => {
					await this.documentRepository.delete(doc.id);
				});
				await Minio.emptyBucket('documents_' + id);
				supportingDocumentation.map(async (doc: Document) => {
					await Minio.verifyBucket('documents_' + id, doc);
					const uri = await Minio.createUR('documents' + id, doc.name);
					await this.createDocument.create(doc.name, uri, organizationSearched);
				});
			}
		}
		organizationSearched.supportingDocumentation = supportingDocumentation;

		const organizationUpdated = await this.organizationRepository.update(
			organizationSearched
		);
		return organizationUpdated;
	}
}
