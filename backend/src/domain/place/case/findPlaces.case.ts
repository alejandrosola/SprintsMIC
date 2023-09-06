import { Injectable, Inject } from '@nestjs/common';
import { IFindPlaces } from '../port/iFindPlaces';
import { IPlaceRepository } from '../port/iPlaceRepository';
import { Place } from '../model/place.entity';

@Injectable()
export class FindPlaces implements IFindPlaces {
	constructor(
		@Inject(IPlaceRepository)
		private readonly placeRepository: IPlaceRepository
	) {}

	async findAll(): Promise<Place[]> {
		return this.placeRepository.findAll();
	}

	async findByName(name: string): Promise<Place> {
		return this.placeRepository.findByName(name);
	}

	async findById(id: string): Promise<Place> {
		return this.placeRepository.findById(id);
	}
}
