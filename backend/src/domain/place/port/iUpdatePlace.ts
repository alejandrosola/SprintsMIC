import { Category } from 'src/domain/category/model/category.entity';
import { PlaceSchedule } from '../model/place-schedule.entity';
import { Place } from '../model/place.entity';
import { Location } from '../model/place-location';
import { PlaceCategory } from '../model/place-category.entity';
import { Accessibility } from '../model/accesibility.entity';
import { Service } from '../model/service.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { MulterFile } from 'multer';
import { PlacePhoto } from '../model/place-photo.entity';

export interface IUpdatePlace {
	update(
		id: string,
		name: string,
		description: string,
		note: string,
		schedules: PlaceSchedule[],
		photos: PlacePhoto[],
		principalCategory: Category,
		// categories: PlaceCategory[],
		url: string,
		phone: string,
		domicile: string,
		location: Location,
		minors: string,
		accessibilities: Accessibility[],
		services: Service[],
		organization: Organization,
		files: MulterFile[],
	): Promise<Place>;
}
