import { Category } from 'src/domain/category/model/category.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from 'src/domain/place/model/accesibility.entity';
import { PlaceCategory } from 'src/domain/place/model/place-category.entity';
import { Location } from 'src/domain/place/model/place-location';
import { PlacePhoto } from 'src/domain/place/model/place-photo.entity';
import { PlaceSchedule } from 'src/domain/place/model/place-schedule.entity';
import { Service } from 'src/domain/place/model/service.entity';

export class PlacePayload {
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
	minors: string;
	accessibilities: Accessibility[];
	services: Service[];
	organization: Organization;
	facebook_url: string;
	twitter_url: string;
	instagram_url: string;
}
