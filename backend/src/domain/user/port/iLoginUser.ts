import { User } from '../model/user.entity';

export interface iLoginUser {
	login(email: string, password: string): Promise<User>;
}
