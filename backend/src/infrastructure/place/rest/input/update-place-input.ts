import { Category } from 'src/domain/category/model/category.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from 'src/domain/place/model/accesibility.entity';
import { PlaceCategory } from 'src/domain/place/model/place-category.entity';
import { Location } from 'src/domain/place/model/place-location';
import { PlacePhoto } from 'src/domain/place/model/place-photo.entity';
import { PlaceSchedule } from 'src/domain/place/model/place-schedule.entity';
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
}
