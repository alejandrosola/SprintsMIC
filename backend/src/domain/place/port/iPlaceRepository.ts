import { Category } from 'src/domain/category/model/category.entity';
import { Location } from '../model/place-location';
import { Place } from '../model/place.entity';

export interface IPlaceRepository {
	findAll(): Promise<Place[]>;
	findById(id: string): Promise<Place>;
	findByName(name: string): Promise<Place>;
	create(place: Place): Promise<Place>;
	delete(name: string): Promise<Place>;
	update(place: Place): Promise<Place>;
	findByDistance(punto: Location): Promise<Place[]>;
	findByCategory(category: Category): Promise<Place[]>;
}

export const IPlaceRepository = Symbol('IPlaceRepository');
