import { Inject, Injectable } from '@nestjs/common';
import { ICreatePlace } from '../port/iCreatePlace';

import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { MinioService } from '../../../util/minio.service';
import { Location } from '../model/place-location';
import { PlacePhoto } from '../model/place-photo.entity';
import { PlaceSchedule } from '../model/place-schedule.entity';
import { Place } from '../model/place.entity';
import { IPlaceRepository } from '../port/iPlaceRepository';

const Minio = new MinioService();

import { Organization } from 'src/domain/organization/model/organization.entity';
import { Accessibility } from '../model/accesibility.entity';
import { PlaceCategory } from '../model/place-category.entity';
import { Service } from '../model/service.entity';
import { IPhotoRepository } from '../port/iPhotoRepository';
import { validatePlace } from './validation';
@Injectable()
export class CreatePlace implements ICreatePlace {
	constructor(
		@Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository,
		@Inject(IPhotoRepository)
		private photoRepository: IPhotoRepository,
	) { }

	async create(
		name: string,
		description: string,
		note: string,
		schedules: PlaceSchedule[],
		photos: PlacePhoto[],
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
		organization: Organization,
		files: MulterFile[],
		facebook_url: string,
		twitter_url: string,
		instagram_url: string,
	): Promise<Place> {
		const aPlace = new Place();
		aPlace.name = name;
		aPlace.description = description;
		aPlace.note = note;
		aPlace.schedules = schedules;
		aPlace.photos = photos;
		aPlace.principalCategory = principalCategory;
		aPlace.categories = categories;
		aPlace.url = url;
		aPlace.phone = phone;
		aPlace.domicile = domicile;
		aPlace.location = location;
		aPlace.origin = origin;
		aPlace.minors = minors;
		aPlace.accessibilities = accessibilities;
		aPlace.services = services;
		aPlace.organization = organization;
		aPlace.facebook_url = facebook_url;
		aPlace.twitter_url = twitter_url;
		aPlace.instagram_url = instagram_url;

		validatePlace(aPlace);
		aPlace.photos = aPlace.photos.length > 0 ? aPlace.photos : null;
		const aPlaceEntity = await this.placeRepository.create(aPlace);

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

		return aPlaceEntity;
	}
}
