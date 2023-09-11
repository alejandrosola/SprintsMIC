import { UserRestMapper } from 'src/infrastructure/user/rest/mapper/user-rest-mapper';
import { OrganizationStatus } from 'src/domain/organization/model/status.enum';
import { Organization } from '../../../../domain/organization/model/organization.entity';
import { OrganizationPayload } from '../payload/organization-payload';
import { CategoryRestMapper } from 'src/infrastructure/category/rest/mapper/category-rest-mapper';

const statusMap: { [key in OrganizationStatus]: string } = {
	[OrganizationStatus.PENDING]: 'Pendiente',
	[OrganizationStatus.ACTIVE]: 'Activo',
	[OrganizationStatus.REJECTED]: 'Rechazado',
	[OrganizationStatus.IN_REVIEW]: 'En revisión',
	[OrganizationStatus.ON_HOLD]: 'En espera',
	[OrganizationStatus.CANCELLED]: 'Cancelado',
	[OrganizationStatus.DELETED]: 'Eliminado',
};

export class OrganizationRestMapper {
	static toPayload(org: Organization): OrganizationPayload {
		return {
			id: org.id,
			legalName: org.legalName,
			address: org.address,
			cuit: org.cuit,
			categories: org.categories
				? org.categories.map((category) =>
						CategoryRestMapper.toPayload(category)
				  )
				: [],
			subcategories: org.subcategories
				? org.subcategories.map((category) =>
						CategoryRestMapper.toPayload(category)
				  )
				: [],
			phone: org.phone,
			owner: org.owner,
			operators: org.operators
				? org.operators.map((operator) => UserRestMapper.toPayload(operator))
				: [],
			supportingDocumentation: org.supportingDocumentation,
			status: statusMap[org.status as OrganizationStatus],
			validator: org.validator,
			updatedAt: org.updatedAt,
			createdAt: org.createdAt,
		};
	}
}
