import { User } from '../model/user.entity';

export interface iRegisterUser {
	register(email: string, password: string): Promise<User>;
	activate(id: string): Promise<User>;
}
