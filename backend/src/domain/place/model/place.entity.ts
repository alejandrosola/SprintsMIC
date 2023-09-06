import { Category } from 'src/domain/category/model/category.entity';
import { PlaceSchedule } from './place-schedule.entity';
import { PlacePhoto } from './place-photo.entity';
import { Location } from './place-location';
import { PlaceCategory } from './place-category.entity';
import { Accessibility } from './accesibility.entity';
import { Service } from './service.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
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
}
