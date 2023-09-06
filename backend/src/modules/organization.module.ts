import { Module } from '@nestjs/common';
import { OrganizationController } from '../infrastructure/organization/rest/controller/organization.controller';
import { IOrganizationRepository } from '../domain/organization/port/iOrganizationRepository';
import { OrganizationRepository } from '../infrastructure/organization/typeorm/repository/organization.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '../infrastructure/organization/typeorm/model/organization.entity';
import { Document } from 'src/infrastructure/organization/typeorm/model/document.entity';
import { IDocumentRepository } from 'src/domain/organization/port/IDocumentRepository';
import { DocumentRepository } from 'src/infrastructure/organization/typeorm/repository/document.repository';

import { CreateOrganization } from 'src/domain/organization/case/createOrganization.case';
import { UpdateOrganization } from 'src/domain/organization/case/updateOrgranization.case';
import { UpdateTakeOrganization } from 'src/domain/organization/case/updateTakeOrgranization.case';
import { UpdateDropOrganization } from 'src/domain/organization/case/updateDropOrgranization.case';
import { UpdateStatusOrganization } from 'src/domain/organization/case/updateStatusOrgranization.case';

import { FindByIdOrganization } from 'src/domain/organization/case/findByIdOrganizations.case';
import { FindAllOrganization } from 'src/domain/organization/case/findAllOrganizations.case';
import { CreateDocument } from 'src/domain/organization/case/createDocument.case';

@Module({
	imports: [TypeOrmModule.forFeature([Organization]), TypeOrmModule.forFeature([Document])],
	controllers: [OrganizationController],
	providers: [
		CreateOrganization,
		UpdateOrganization,
		UpdateTakeOrganization,
		UpdateDropOrganization,
		UpdateStatusOrganization,
		FindByIdOrganization,
		FindAllOrganization,
		CreateDocument,
		{
			provide: IOrganizationRepository,
			useClass: OrganizationRepository,
		},
		{
			provide: IDocumentRepository,
			useClass: DocumentRepository,
		},
	],
})
export class OrganizationModule { }
