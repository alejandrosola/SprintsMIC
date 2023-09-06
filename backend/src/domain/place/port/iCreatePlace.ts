import { Category } from 'src/domain/category/model/category.entity';
import { PlaceSchedule } from '../model/place-schedule.entity';
import { Place } from '../model/place.entity';
import { Location } from '../model/place-location';
import { PlaceCategory } from '../model/place-category.entity';
import { MulterFile } from 'multer';
import { Service } from '../model/service.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from '../model/accesibility.entity';

export interface ICreatePlace {
	create(
		name: string,
		description: string,
		note: string,
		schedules: PlaceSchedule[],
		photos: MulterFile[],
		principalCategory: Category,
		categories: PlaceCategory[],
		url: string,
		phone: string,
		domicile: string,
		location: Location,
		origin: string,
		minors: string,
		accessibilities: Accessibility[],
		services: Service[],
		organization: Organization
	): Promise<Place>;
}
