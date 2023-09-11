import { Category } from 'src/domain/category/model/category.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from 'src/domain/place/model/accesibility.entity';
import { PlaceCategory } from 'src/domain/place/model/place-category.entity';
import { Location } from 'src/domain/place/model/place-location';
import { PlaceSchedule } from 'src/domain/place/model/place-schedule.entity';
import { Service } from 'src/domain/place/model/service.entity';

export class PlaceInput {
	name: string;
	description: string;
	note: string;
	schedules: PlaceSchedule[];
	photos: string;
	principalCategory: Category;
	categories: PlaceCategory[];
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
