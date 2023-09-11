import { Place } from '../model/place.entity';

export interface IFindByCategory {
	findAll(categoryId: string): Promise<Place[]>;
}
