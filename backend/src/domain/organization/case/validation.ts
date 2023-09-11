import { Organization } from '../model/organization.entity';
import { OrganizationStatus } from '../model/status.enum';
import { User } from 'src/domain/user/model/user.entity';
import { Document } from '../model/document.entity';

function areEqualDocuments(docs1: Document[], docs2: Document[]): boolean {
	if (docs1.length != docs2.length) return false;
	for (let i = 0; i < docs1.length; i++) {
		if (docs1[i] != docs2[2]) return false;
	}
	return true;
}

export function validateChangesByStatus(
	aOrganization: Organization,
	legalName: string,
	cuit: string,
	owner: User,
	supportingDocumentation: Document[],
	status: string,
	validator: User
): void {
	if (!aOrganization) {
		throw new Error('Organizacion inexistente');
	}

	console.log(aOrganization.id);

	if (
		aOrganization.status === OrganizationStatus.ACTIVE ||
		aOrganization.status === OrganizationStatus.IN_REVIEW
	) {
		if (
			aOrganization.legalName !== legalName ||
			aOrganization.cuit !== cuit ||
			aOrganization.owner.email !== owner.email ||
			!areEqualDocuments(
				aOrganization.supportingDocumentation,
				supportingDocumentation
			) ||
			/* aOrganization.status != status || */
			aOrganization.validator.email !== validator.email
		) {
			throw new Error(
				'No se pueden cambiar los campos solicitados de una organización activa o en revisión'
			);
		}
	}
}
