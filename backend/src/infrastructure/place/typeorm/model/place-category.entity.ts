import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Place } from './place.entity';
import { Category } from '../../../category/typeorm/model/category.entity';

@Entity({ name: 'place_categories' })
export class PlaceCategory {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Place, (place) => place.categories)
	place: Place;

	@ManyToOne(() => Category)
	category: Category;
}
