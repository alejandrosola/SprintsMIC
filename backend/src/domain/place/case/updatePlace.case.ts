import { Injectable, Inject } from '@nestjs/common';
import { IPlaceRepository } from '../port/iPlaceRepository';
import { IUpdatePlace } from '../port/iUpdatePlace';
import { Category } from 'src/domain/category/model/category.entity';
import { PlaceSchedule } from '../model/place-schedule.entity';
import { Place } from '../model/place.entity';
import { Location } from '../model/place-location';
import { PlaceCategory } from '../model/place-category.entity';
import { validatePlace } from './validation';
import { MulterFile } from 'multer';
import { IPhotoRepository } from '../port/iPhotoRepository';
import { Accessibility } from '../model/accesibility.entity';
import { Service } from '../model/service.entity';
import { Organization } from 'src/domain/organization/model/organization.entity';
import { MinioService } from 'src/util/minio.service';
import { PlacePhoto } from '../model/place-photo.entity';

const Minio = new MinioService();

@Injectable()
export class UpdatePlace implements IUpdatePlace {
	constructor(
		@Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository,
		@Inject(IPhotoRepository)
		private photoRepository: IPhotoRepository,
	) { }
	async update(
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
	): Promise<Place> {
		const aPlace = new Place();
		aPlace.id = id;
		aPlace.name = name;
		aPlace.description = description;
		aPlace.note = note;
		aPlace.schedules = schedules;
		aPlace.photos = photos;
		aPlace.principalCategory = principalCategory;
		// aPlace.categories = categories;
		aPlace.url = url;
		aPlace.phone = phone;
		aPlace.domicile = domicile;
		aPlace.location = location;
		aPlace.minors = minors;
		aPlace.accessibilities = accessibilities;
		aPlace.services = services;
		aPlace.organization = organization;

		validatePlace(aPlace);

		const aPlaceEntity = await this.placeRepository.update(aPlace);

		for (const foto of files) {
			await Minio.verifyBucket(`place-${aPlaceEntity.id}`, foto);

			const uri = await Minio.createUR(
				`place-${aPlaceEntity.id}`,
				foto.originalname
			);

			const aFoto = new PlacePhoto();
			aFoto.photoUrl = uri;

			await this.photoRepository.create(aFoto, aPlaceEntity);
		}

		// for (const foto of await Minio.listAllObjects(`place-${aPlaceEntity.id}`)) {
		// 	if (!photos.find((aFoto) => aFoto.originalname === foto.name)) {
		// 		console.log(foto);
		// 		Minio.removeFile(`place-${aPlaceEntity.id}`, foto.name);
		// 	}
		// }



		return aPlaceEntity;
	}
}
