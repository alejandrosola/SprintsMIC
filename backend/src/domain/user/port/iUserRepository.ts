import { User } from '../model/user.entity';

export interface IUserRepository {
	findAll(): Promise<User[]>;
	findByID(id: string): Promise<User>;
	findByEmail(email: string): Promise<User>;
	save(aUser: User): Promise<User>;
	update(aUser: User): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
