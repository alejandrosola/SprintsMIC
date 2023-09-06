import { Role } from './role.entity';

export class User {
	id: string;

	name: string;

	fechaNacimiento: Date;

	password: string;

	email: string;

	status: string;

	avatar: string;

	roles: Role[];

	createdAt: Date;

	updatedAt: Date;

	deletedAt: Date;
}
