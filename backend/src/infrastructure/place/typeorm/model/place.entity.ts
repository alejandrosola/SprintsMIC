import {
	Column,
	Entity,
	ManyToOne,
	OneToMany,
	Point,
	ManyToMany,
	JoinTable,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../../category/typeorm/model/category.entity';
import { PlaceCategory } from './place-category.entity';
import { Accessibility } from './accesibility.entity';
import { Service } from './service.entity';
import { Organization } from '../../../organization/typeorm/model/organization.entity';
import { PlacePhoto } from './place-photo.entity';
import { PlaceSchedule } from './place-schedule.entity';

@Entity({ name: 'places' })
export class Place {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'description', nullable: true })
	description: string;

	@Column({ name: 'note', nullable: true })
	note: string;

	@OneToMany(() => PlaceSchedule, (schedule) => schedule.place)
	schedules: PlaceSchedule[];

	@OneToMany(() => PlacePhoto, (photo) => photo.place)
	photos: PlacePhoto[];

	@ManyToOne(() => Category, (principalCategory) => principalCategory)
	principalCategory: Category;

	@OneToMany(() => PlaceCategory, (categories) => categories.place)
	categories: PlaceCategory[];

	@Column({ name: 'url', nullable: true })
	url: string;

	@Column({ name: 'phone', nullable: true })
	phone: string;

	@Column({ name: 'domicile', nullable: true })
	domicile: string;

	@Column({
		type: 'geography',
		spatialFeatureType: 'Point',
		name: 'location',
		nullable: true,
	})
	location: Point;

	@Column({ name: 'origin' })
	origin: string;

	@Column({ name: 'minors' })
	minors: string;

	@ManyToMany(() => Accessibility)
	@JoinTable({
		name: 'place_accessibilities',
		joinColumn: {
			name: 'place_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'accessibility_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
	})
	accessibilities: Accessibility[];

	@ManyToMany(() => Service)
	@JoinTable({
		name: 'place_services',
		joinColumn: {
			name: 'place_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'service_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
	})
	services: Service[];

	@ManyToOne(() => Organization, (organization) => organization)
	organization: Organization;
}
