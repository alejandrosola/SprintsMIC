import { Category } from 'src/domain/category/model/category.entity';
import { Place } from './place.entity';

export class PlaceCategory {
	id: string;
	place: Place;
	category: Category;
}
