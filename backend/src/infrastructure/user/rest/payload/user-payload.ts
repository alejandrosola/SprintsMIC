import { Role } from "src/domain/user/model/role.entity";

export class UserPayload {
	id: string;
	name: string;
	fechaNacimiento: Date;
	roles: Role[];
	email: string;
	status: string;
	avatar: string;
}
