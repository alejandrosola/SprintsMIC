import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Place as DomainPlace } from 'src/domain/place/model/place.entity';
import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository';
import { Category as TypeORMCategory } from 'src/infrastructure/category/typeorm/model/category.entity';
import {
	Place,
	Place as TypeORMPlace,
} from 'src/infrastructure/place/typeorm/model/place.entity';
import { Repository } from 'typeorm';
import { PlaceMapper } from '../mapper/place-typeorm.mapper';
import { DayOfWeek as TypeORMDayOfWeek } from '../model/day-of-week.entity';
import {
	PlaceCategory,
	PlaceCategory as TypeORMPlaceCategory,
} from '../model/place-category.entity';
import { PlacePhoto as TypeORMPlacePhoto } from '../model/place-photo.entity';
import {
	PlaceSchedule,
	PlaceSchedule as TypeORMPlaceSchedule,
} from '../model/place-schedule.entity';
import { Accessibility } from '../model/accesibility.entity';
import { Service } from '../model/service.entity';

@Injectable()
export class PlaceRepository implements IPlaceRepository {
	constructor(
		@InjectRepository(TypeORMPlace)
		private readonly placeRepository: Repository<TypeORMPlace>,
		@InjectRepository(TypeORMPlaceSchedule)
		private readonly scheduleRepository: Repository<TypeORMPlaceSchedule>,
		@InjectRepository(TypeORMDayOfWeek)
		private readonly dayOfWeekRepository: Repository<TypeORMDayOfWeek>,
		@InjectRepository(TypeORMPlacePhoto)
		private readonly photoRepository: Repository<TypeORMPlacePhoto>,
		@InjectRepository(TypeORMCategory)
		private readonly categoryRepository: Repository<TypeORMCategory>,
		@InjectRepository(TypeORMPlaceCategory)
		private readonly placeCategoryRepository: Repository<TypeORMPlaceCategory>,
		@InjectRepository(Accessibility)
		private readonly accesibilityRepository: Repository<Accessibility>,
		@InjectRepository(Service)
		private readonly serviceRepository: Repository<Service>
	) { }

	async findById(id: string): Promise<DomainPlace> {
		const place = await this.placeRepository.findOne({
			where: { id: id },
			relations: [
				'accessibilities',
				'services',
				'organization',
				'schedules',
				'schedules.dayOfWeek',
				'photos',
				'categories',
				'categories.category',
				'principalCategory',
			],
		});

		return place ? PlaceMapper.toDomain(place) : null;
	}

	async findAll(): Promise<DomainPlace[]> {
		const places: TypeORMPlace[] = await this.placeRepository.find({
			relations: [
				'accessibilities',
				'services',
				'organization',
				'schedules',
				'schedules.dayOfWeek',
				'photos',
				'categories',
				'categories.category',
				'principalCategory',
			],
		});

		return places.map((place) => PlaceMapper.toDomain(place));
	}

	async create(aPlace: DomainPlace): Promise<DomainPlace> {
		const typeORMPlace = PlaceMapper.toTypeORM(aPlace);
		typeORMPlace.schedules = await this.getScheduleDays(typeORMPlace);
		typeORMPlace.principalCategory = await this.categoryRepository.findOne({
			where: { name: aPlace.principalCategory.name },
		});
		typeORMPlace.accessibilities = await this.getAccessibilities(typeORMPlace);
		typeORMPlace.services = await this.getServices(typeORMPlace);

		const savedPlace = await this.placeRepository.save(typeORMPlace);
		await this.savePlaceRelations(typeORMPlace);
		return PlaceMapper.toDomain(savedPlace);
	}

	async update(place: DomainPlace): Promise<DomainPlace> {
		console.log("🚀 ~ file: place.repository.ts:98 ~ PlaceRepository ~ update ~ place:", place)
		const placeEntity = await this.findById(place.id);
		const placeORM = placeEntity ? PlaceMapper.toTypeORM(place) : null;

		placeORM.principalCategory = place.principalCategory
			? await this.categoryRepository.findOne({
				where: { name: place.principalCategory.name },
			})
			: null;

		if (placeORM) {
			placeORM.id = place.id;
			placeORM.origin = 'WEB';
		}

		for (const schedule of placeEntity.schedules) {
			if (
				!placeORM.schedules.find((aSchedule) => aSchedule.id === schedule.id)
			) {
				this.scheduleRepository.delete(schedule);
			}
		}

		for (const placeCategory of placeEntity.categories) {
			if (
				!placeORM.categories.find(
					(aPlaceCategory) => aPlaceCategory.id === placeCategory.id
				)
			) {
				this.placeCategoryRepository.delete(placeCategory.id);
			}
		}

		placeORM.categories = await this.getCategories(placeORM);
		placeEntity.photos.forEach((photo) => {
			if (!placeORM.photos.find((aPhoto) => aPhoto.id === photo.id)) {
				console.log("🚀 ~ file: place.repository.ts:133 ~ PlaceRepository ~ placeEntity.photos.forEach ~ photo.id:", photo.id)
				// this.photoRepository.delete(photo.id);
			}
		});

		placeORM.schedules = await this.getScheduleDays(placeORM);

		placeORM.accessibilities = await this.getAccessibilities(placeORM);
		placeORM.services = await this.getServices(placeORM);
		try {
			const updatedPlace = placeORM
				? await this.placeRepository.save(placeORM)
				: null;
			await this.savePlaceRelations(placeORM);
			return updatedPlace ? PlaceMapper.toDomain(updatedPlace) : null;
		} catch (error) {
			throw new Error(`${error.query}`);
		}
	}

	async findByName(name: string): Promise<DomainPlace> {
		const aPlaceORM = await this.placeRepository.findOne({
			where: { name: name },
		});

		return aPlaceORM ? PlaceMapper.toDomain(aPlaceORM) : null;
	}

	async delete(id: string): Promise<DomainPlace> {
		const aPlace = await this.findById(id);
		const deletedPlace = aPlace
			? await this.placeRepository.remove(PlaceMapper.toTypeORM(aPlace))
			: null;
		return deletedPlace ? PlaceMapper.toDomain(deletedPlace) : null;
	}

	private async savePlaceRelations(place: Place): Promise<TypeORMPlace> {
		place.schedules.forEach(async (schedule) => {
			schedule.place = place;
			await this.scheduleRepository.save(schedule);
		});

		/* place.photos.forEach(async (photo) => {
			photo.place = place;
			await this.photoRepository.save(photo);
		}); */

		place.categories.forEach(async (placeCategory) => {
			placeCategory.place = place;
			await this.placeCategoryRepository.save(placeCategory);
		});

		return place;
	}

	private async getAccessibilities(
		place: TypeORMPlace
	): Promise<Accessibility[]> {
		const someAccessibilities = [];
		for (let a of place.accessibilities) {
			a = await this.accesibilityRepository.findOne({
				where: { name: a.name },
			});
			someAccessibilities.push(a);
		}

		return someAccessibilities;
	}

	private async getServices(place: TypeORMPlace): Promise<Service[]> {
		const someServices = [];
		for (let s of place.services) {
			s = await this.serviceRepository.findOne({ where: { name: s.name } });
			someServices.push(s);
		}
		return someServices;
	}

	private async getScheduleDays(place: TypeORMPlace): Promise<PlaceSchedule[]> {
		const someSchedules = [];
		for (const schedule of place.schedules) {
			schedule.dayOfWeek = await this.dayOfWeekRepository.findOne({
				where: { name: schedule.dayOfWeek.name },
			});
			someSchedules.push(schedule);
		}
		return someSchedules;
	}

	private async getCategories(place: TypeORMPlace): Promise<PlaceCategory[]> {
		const someCategories: PlaceCategory[] = [];
		for (const category of place.categories) {
			category.category = await this.categoryRepository.findOne({
				where: { name: category.category.name },
			});
			someCategories.push(category);
		}
		return someCategories;
	}
}
