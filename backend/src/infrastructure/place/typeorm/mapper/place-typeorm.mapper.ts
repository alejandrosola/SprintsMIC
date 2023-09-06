import { Place as TypeORMPlace } from '../model/place.entity';
import { Place as DomainPlace } from '../../../../domain/place/model/place.entity';

import { PlacePhoto as TypeORMPlacePhoto } from '../model/place-photo.entity';
import { PlacePhoto as DomainPlacePhoto } from '../../../../domain/place/model/place-photo.entity';

import { DayOfWeek as DomainDayOfWeek } from '../../../../domain/place/model/day-of-week.entity';
import { DayOfWeek as TypeORMDayOfWeek } from '../model/day-of-week.entity';
import { PlaceSchedule as DomainPlaceSchedule } from 'src/domain/place/model/place-schedule.entity';
import { PlaceSchedule as TypeORMPlaceSchedule } from '../model/place-schedule.entity';
import { PlaceCategory as DomainPlaceCategory } from 'src/domain/place/model/place-category.entity';
import { PlaceCategory as TypeORMPlaceCategory } from '../model/place-category.entity';
import { Category as DomainCategory } from 'src/domain/category/model/category.entity';
import { Category as TypeORMCategory } from 'src/infrastructure/category/typeorm/model/category.entity';
import { Accessibility as DomainAccessibility } from 'src/domain/place/model/accesibility.entity';
import { Accessibility as TypeORMAccessibility } from 'src/infrastructure/place/typeorm/model/accesibility.entity';
import { Service as DomainService } from 'src/domain/place/model/service.entity';
import { Service as TypeORMService } from 'src/infrastructure/place/typeorm/model/service.entity';

export class PlaceMapper {
	static toDomain(place: TypeORMPlace): DomainPlace {
		return {
			id: place.id,
			name: place.name || null,
			description: place.description || null,
			note: place.note || null,
			schedules: place.schedules
				? place.schedules.map((schedule) => this.scheduleToDomain(schedule))
				: [],
			photos: place.photos
				? place.photos.map((photo) => this.photoToDomain(photo))
				: [],
			principalCategory: place.principalCategory || null,
			categories: place.categories
				? place.categories.map((category) =>
					this.placeCategoryToDomain(category)
				)
				: [],
			url: place.url || null,
			phone: place.phone || null,
			domicile: place.domicile || null,
			origin: place.origin || null,
			location: {
				lat: place.location?.coordinates[0] || null,
				lng: place.location?.coordinates[1] || null,
			},
			minors: place.minors,
			organization: place.organization || null,
			accessibilities: place.accessibilities
				? place.accessibilities.map((accessibility) =>
					this.accessibilityToDomain(accessibility)
				)
				: [],
			services: place.services
				? place.services.map((service) => this.serviceToDomain(service))
				: [],
			// Aquí puedes mapear las propiedades adicionales según necesites
		};
	}

	static toTypeORM(domainPlace: DomainPlace): TypeORMPlace {
		const typeORMPlace = new TypeORMPlace();
		typeORMPlace.id = domainPlace.id;
		typeORMPlace.name = domainPlace.name || null;
		typeORMPlace.description = domainPlace.description || null;
		typeORMPlace.note = domainPlace.note || null;
		typeORMPlace.schedules = domainPlace.schedules
			? domainPlace.schedules.map((schedule) =>
				this.scheduleToTypeORM(schedule)
			)
			: [];
		typeORMPlace.photos = domainPlace.photos
			? domainPlace.photos.map((photo) => this.photoToTypeORM(photo))
			: [];
		typeORMPlace.categories = domainPlace.categories
			? domainPlace.categories.map((category) =>
				this.placeCategoryToTypeORM(category)
			)
			: [];
		typeORMPlace.url = domainPlace.url || null;
		typeORMPlace.phone = domainPlace.phone || null;
		typeORMPlace.domicile = domainPlace.domicile || null;
		typeORMPlace.origin = domainPlace.origin || null;
		typeORMPlace.location = {
			type: 'Point',
			coordinates: [
				domainPlace.location?.lat || 0,
				domainPlace.location?.lng || 0,
			],
		};
		typeORMPlace.minors = domainPlace.minors;
		typeORMPlace.organization = domainPlace.organization || null;
		typeORMPlace.accessibilities = domainPlace.accessibilities
			? domainPlace.accessibilities.map((accesibility) =>
				this.accessibilityToTypeORM(accesibility)
			)
			: [];
		typeORMPlace.services = domainPlace.services
			? domainPlace.services.map((service) => this.serviceToTypeORM(service))
			: [];
		// Aquí puedes mapear las propiedades adicionales según necesites

		return typeORMPlace;
	}

	private static scheduleToDomain(
		schedule: TypeORMPlaceSchedule
	): DomainPlaceSchedule {
		return {
			id: schedule.id,
			dayOfWeek: this.dayOfWeekToDomain(schedule.dayOfWeek),
			openingHour: schedule.openingHour,
			closingHour: schedule.closingHour,
		};
	}

	private static scheduleToTypeORM(
		schedule: DomainPlaceSchedule
	): TypeORMPlaceSchedule {
		const typeORMSchedule = new TypeORMPlaceSchedule();
		typeORMSchedule.id = schedule.id;
		typeORMSchedule.dayOfWeek = this.dayOfWeekToTypeORM(schedule.dayOfWeek);
		typeORMSchedule.openingHour = schedule.openingHour;
		typeORMSchedule.closingHour = schedule.closingHour;
		return typeORMSchedule;
	}

	private static accessibilityToTypeORM(
		accesibility: DomainAccessibility
	): TypeORMAccessibility {
		const typeORMAccessibility = new TypeORMAccessibility();
		typeORMAccessibility.id = accesibility.id;
		typeORMAccessibility.name = accesibility.name;
		return typeORMAccessibility;
	}

	private static accessibilityToDomain(
		accesibility: TypeORMAccessibility
	): DomainAccessibility {
		return {
			id: accesibility.id,
			name: accesibility.name,
		};
	}

	private static serviceToTypeORM(service: DomainService): TypeORMService {
		const typeORMService = new TypeORMService();
		typeORMService.id = service.id;
		typeORMService.name = service.name;
		return typeORMService;
	}

	private static serviceToDomain(service: TypeORMService): DomainService {
		return {
			id: service.id,
			name: service.name,
		};
	}

	private static placeCategoryToTypeORM(placeCategory: DomainPlaceCategory) {
		const typeORMCategory = new TypeORMPlaceCategory();
		typeORMCategory.id = placeCategory.id;
		typeORMCategory.category = this.categoryToTypeORM(placeCategory.category);

		return typeORMCategory;
	}

	private static placeCategoryToDomain(placeCategory: TypeORMPlaceCategory) {
		const placeCategoryDomain = new DomainPlaceCategory();
		placeCategoryDomain.id = placeCategory.id;
		placeCategoryDomain.category = this.categoryToDomain(
			placeCategory.category
		);
		return placeCategoryDomain;
	}

	private static categoryToDomain(category: TypeORMCategory) {
		const domainCategory = new DomainCategory();
		domainCategory.id = category.id;
		domainCategory.name = category.name;
		domainCategory.father = category.father
			? this.categoryToDomain(category.father)
			: null;
		return domainCategory;
	}

	private static categoryToTypeORM(category: DomainCategory) {
		const typeORMCategory = new TypeORMCategory();
		typeORMCategory.id = category.id;
		typeORMCategory.name = category.name;
		typeORMCategory.father = category.father
			? this.categoryToTypeORM(category.father)
			: null;

		return typeORMCategory;
	}

	private static photoToDomain(photo: TypeORMPlacePhoto): DomainPlacePhoto {
		return {
			id: photo.id,
			photoUrl: photo.photoUrl,
			//place: this.toDomain(aPlace),
		};
	}

	private static photoToTypeORM(photo: DomainPlacePhoto): TypeORMPlacePhoto {
		const typeORMPhoto = new TypeORMPlacePhoto();
		//aPlace.photos = [];
		typeORMPhoto.id = photo.id;
		typeORMPhoto.photoUrl = photo.photoUrl;
		return typeORMPhoto;
	}

	private static dayOfWeekToDomain(
		dayOfWeek: TypeORMDayOfWeek
	): DomainDayOfWeek {
		return {
			id: dayOfWeek.id,
			name: dayOfWeek.name,
		};
	}

	private static dayOfWeekToTypeORM(
		dayOfWeek: DomainDayOfWeek
	): TypeORMDayOfWeek {
		const typeORMDayOfWeek = new TypeORMDayOfWeek();
		typeORMDayOfWeek.id = dayOfWeek.id;
		typeORMDayOfWeek.name = dayOfWeek.name;
		return typeORMDayOfWeek;
	}
}
