import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'fechaNacimiento' })
	fechaNacimiento: Date;

	@Column({ name: 'password' })
	password: string;

	@Column({ name: 'email' })
	email: string;

	@Column({ name: 'status' })
	status: string;

	@Column({ name: 'avatar' })
	avatar: string;

	@ManyToMany(() => Role)
	@JoinTable({
		name: 'user_roles',
		joinColumn: {
			name: "user_id",  // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "role_id",  // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: "id"
		}
	})
	roles: Role[];

	@CreateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
	})
	createdAt: Date;

	@UpdateDateColumn({
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP(6)',
		onUpdate: 'CURRENT_TIMESTAMP(6)',
	})
	updatedAt: Date;

	@DeleteDateColumn({ type: 'timestamp', default: () => null })
	deletedAt: Date;
}
