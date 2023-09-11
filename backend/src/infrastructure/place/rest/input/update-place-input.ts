import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from 'src/domain/place/model/accesibility.entity';
import { Service } from 'src/domain/place/model/service.entity';

export class UpdatePlaceInput {
	id: string;
	name: string;
	description: string;
	note: string;
	schedules: string;
	photos: string;
	principalCategory: string;
	categories: string;
	url: string;
	phone: string;
	domicile: string;
	location: string;
	minors: string;
	accessibilities: Accessibility[];
	services: Service[];
	organization: Organization;
	facebook_url: string;
	twitter_url: string;
	instagram_url: string;
}
