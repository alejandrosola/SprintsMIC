import { User } from '../model/user.entity';

export interface IfindUsers {
	findAll(): Promise<User[]>;
}
