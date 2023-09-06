import { Place } from '../model/place.entity';

export interface IPlaceRepository {
	findAll(): Promise<Place[]>;
	findById(id: string): Promise<Place>;
	findByName(name: string): Promise<Place>;
	create(place: Place): Promise<Place>;
	delete(name: string): Promise<Place>;
	update(place: Place): Promise<Place>;
}

export const IPlaceRepository = Symbol('IPlaceRepository');
