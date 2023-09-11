import { Category } from 'src/domain/category/model/category.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from './accesibility.entity';
import { PlaceCategory } from './place-category.entity';
import { Location } from './place-location';
import { PlacePhoto } from './place-photo.entity';
import { PlaceSchedule } from './place-schedule.entity';
import { Service } from './service.entity';

export class Place {
	id: string;
	name: string;
	description: string;
	note: string;
	schedules: PlaceSchedule[]; //Falta en migracion
	photos: PlacePhoto[];
	principalCategory: Category;
	categories: PlaceCategory[]; //Falta en migracion
	url: string;
	phone: string;
	domicile: string;
	location: Location;
	origin: string;
	minors: string;
	accessibilities: Accessibility[];
	services: Service[];
	organization: Organization;
	facebook_url: string;
	twitter_url: string;
	instagram_url: string;
}
