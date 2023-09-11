import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from 'src/domain/place/model/place-location';
import { Place as DomainPlace } from 'src/domain/place/model/place.entity';
import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository';
import {
	Category,
	Category as TypeORMCategory,
} from 'src/infrastructure/category/typeorm/model/category.entity';
import {
	Place,
	Place as TypeORMPlace,
} from 'src/infrastructure/place/typeorm/model/place.entity';
import { Repository } from 'typeorm';
import { PlaceMapper } from '../mapper/place-typeorm.mapper';
import { Accessibility } from '../model/accesibility.entity';
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
import { Service } from '../model/service.entity';


import { Category as DomainCategory } from 'src/domain/category/model/category.entity';
import { CategoryMapper } from 'src/infrastructure/category/typeorm/mapper/category.typeorm.mapper';

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

	async findByDistance(punto: Location): Promise<DomainPlace[]> {
		try {
			const places = await this.placeRepository
				.createQueryBuilder('place')
				.orderBy(
					`ST_Distance(place.location::geography, ST_MakePoint(${punto.lat}, ${punto.lng})::geography)`
				)
				.getMany();

			return places.map((place) => PlaceMapper.toDomain(place));
		} catch (error) {
			console.error(error);
		}
	}

	private async getFatherIds(category: TypeORMCategory): Promise<string[]> {
		const someFathers = [];
		let aFather = (
			await this.categoryRepository.findOne({
				where: { id: category.id },
				relations: ['father'],
			})
		).father;

		while (aFather) {
			someFathers.push(aFather.id);
			aFather = (
				await this.categoryRepository.findOne({
					where: { id: aFather.id },
					relations: ['father'],
				})
			).father;
		}

		return someFathers;
	}

	async findByCategory(category: DomainCategory): Promise<DomainPlace[]> {
		const typeORMCategory = CategoryMapper.toTypeORM(category);

		const fatherIds = await this.getFatherIds(typeORMCategory);

		const someCategoryPlaces = await this.placeRepository
			.createQueryBuilder('place')
			.leftJoinAndSelect('place.categories', 'categories')
			.where('category.id = :catId', {
				catId: typeORMCategory.id,
			})
			.leftJoinAndSelect('categories.category', 'category')
			.leftJoinAndSelect('place.accessibilities', 'accessibilities')
			.leftJoinAndSelect('place.services', 'services')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoinAndSelect('place.schedules', 'schedules')
			.leftJoinAndSelect('place.photos', 'photos')
			.leftJoinAndSelect('place.principalCategory', 'principalCategory')
			.orWhere('principalCategory.id = :catId', {
				catId: typeORMCategory.id,
			})
			.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
			.getMany();

		const someFatherPlaces =
			fatherIds.length != 0
				? await this.placeRepository
					.createQueryBuilder('place')
					.leftJoinAndSelect('place.categories', 'categories')
					.leftJoinAndSelect('categories.category', 'category')
					.leftJoinAndSelect('category.father', 'father')
					.where('father.id IN (:...fatherIds)', {
						fatherIds: fatherIds,
					})
					.leftJoinAndSelect('place.accessibilities', 'accessibilities')
					.leftJoinAndSelect('place.services', 'services')
					.leftJoinAndSelect('place.organization', 'organization')
					.leftJoinAndSelect('place.schedules', 'schedules')
					.leftJoinAndSelect('place.photos', 'photos')
					.leftJoinAndSelect('place.principalCategory', 'principalCategory')
					.leftJoinAndSelect('principalCategory.father', 'principalFather')
					.orWhere('principalFather.id IN (:...fatherIds)', {
						fatherIds: fatherIds,
					})
					.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
					.getMany()
				: [];

		let someChildrenPlaces = await this.placeRepository
			.createQueryBuilder('place')
			.leftJoinAndSelect('place.categories', 'categories')
			.leftJoinAndSelect('categories.category', 'category')
			.leftJoinAndSelect('category.father', 'father')
			.where('father.id = :fatherId', {
				fatherId: typeORMCategory.id,
			})
			.leftJoinAndSelect('place.accessibilities', 'accessibilities')
			.leftJoinAndSelect('place.services', 'services')
			.leftJoinAndSelect('place.organization', 'organization')
			.leftJoinAndSelect('place.schedules', 'schedules')
			.leftJoinAndSelect('place.photos', 'photos')
			.leftJoinAndSelect('place.principalCategory', 'principalCategory')
			.leftJoinAndSelect('principalCategory.father', 'principalFather')
			.orWhere('principalFather.id = :fatherId', {
				fatherId: typeORMCategory.id,
			})
			.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
			.getMany();

		let termine = false;
		while (!termine) {
			termine = true;
			const newFatherIds = [];
			someChildrenPlaces.forEach(async (place) => {
				if (
					(await this.getFatherIds(place.principalCategory)).includes(
						typeORMCategory.id
					)
				) {
					newFatherIds.push(place.principalCategory.id);
				} else {
					place.categories.forEach(async (category) => {
						if (
							(await this.getFatherIds(category.category)).includes(
								typeORMCategory.id
							)
						) {
							newFatherIds.push(category.category.id);
						}
					});
				}
			});
			termine = newFatherIds.length != 0 ? false : true;
			someChildrenPlaces =
				newFatherIds.length != 0
					? someChildrenPlaces.concat(
						await this.placeRepository
							.createQueryBuilder('place')
							.leftJoinAndSelect('place.categories', 'categories')
							.leftJoinAndSelect('categories.category', 'category')
							.leftJoinAndSelect('category.father', 'father')
							.where('father.id IN (:...fatherIds)', {
								fatherIds: newFatherIds,
							})
							.leftJoinAndSelect('place.accessibilities', 'accessibilities')
							.leftJoinAndSelect('place.services', 'services')
							.leftJoinAndSelect('place.organization', 'organization')
							.leftJoinAndSelect('place.schedules', 'schedules')
							.leftJoinAndSelect('place.photos', 'photos')
							.leftJoinAndSelect(
								'place.principalCategory',
								'principalCategory'
							)
							.leftJoinAndSelect(
								'principalCategory.father',
								'principalFather'
							)
							.orWhere('principalFather.id IN (:...fatherIds)', {
								fatherIds: newFatherIds,
							})
							.leftJoinAndSelect('schedules.dayOfWeek', 'dayOfWeek')
							.getMany()
					)
					: someChildrenPlaces;
		}

		const answer = someCategoryPlaces.concat(
			someChildrenPlaces.concat(someFatherPlaces)
		);

		const uniquePlaces = Array.from(
			new Set(answer.map((place) => place.id))
		).map((id) => answer.find((place) => place.id === id));

		return uniquePlaces.map((place) => PlaceMapper.toDomain(place));
	}

	async create(aPlace: DomainPlace): Promise<DomainPlace> {
		console.log("Create en repository: ", aPlace)
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

		for (const photo of placeEntity.photos) {
			if (!placeORM.photos.find((aPhoto) => aPhoto.id === photo.id)) {
				this.photoRepository.delete(photo.id);
			}
		}

		placeORM.categories = await this.getCategories(placeORM);
		placeEntity.photos.forEach((photo) => {
			if (!placeORM.photos.find((aPhoto) => aPhoto.id === photo.id)) {
				console.log(
					'🚀 ~ file: place.repository.ts:133 ~ PlaceRepository ~ placeEntity.photos.forEach ~ photo.id:',
					photo.id
				);
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

		//  place.photos.forEach(async (photo) => {
		// 	photo.place = place;
		// 	await this.photoRepository.save(photo);
		// });

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

	private async getPrincipalCategory(place: TypeORMPlace): Promise<Category> {
		const aPrincipalCategory = await this.categoryRepository.findOne({
			where: { name: place.principalCategory.name },
		});
		return aPrincipalCategory;
	}

	private async getPhotos(place: TypeORMPlace): Promise<TypeORMPlacePhoto[]> {
		const somePhotos: TypeORMPlacePhoto[] = [];
		for (let photo of place.photos) {
			photo = await this.photoRepository.findOne({
				where: { photoUrl: photo.photoUrl },
			});
			somePhotos.push(photo);
		}
		return somePhotos;
	}
}
