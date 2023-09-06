import { Organization } from '../../../../domain/organization/model/organization.entity';
import { OrganizationPayload } from '../payload/organization-payload';

export class OrganizationRestMapper {
	static toPayload(org: Organization): OrganizationPayload {
		return {
			id: org.id,
			legalName: org.legalName,
			address: org.address,
			cuit: org.cuit,
			categories: org.categories,
			subcategories: org.subcategories,
			phone: org.phone,
			owner: org.owner,
			operators: org.operators,
			supportingDocumentation: org.supportingDocumentation,
			status: org.status,
			validator: org.validator,
			updatedAt: org.updatedAt
		};
	}
}