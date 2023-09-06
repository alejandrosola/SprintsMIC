import { Injectable, Inject } from '@nestjs/common';
import { User } from '../model/user.entity';
import { IUserRepository } from '../port/iUserRepository';
import { iLoginUser } from '../port/iLoginUser';
import { status } from '../model/status.enum';
const normalizeEmail = require('normalize-email');
const bcrypt = require('bcrypt');

@Injectable()
export class LoginUser implements iLoginUser {
	constructor(
		@Inject(IUserRepository)
		private userRepository: IUserRepository
	) { }

	async login(email: string, password: string): Promise<User> {
		const aUser = new User();
		aUser.email = normalizeEmail(email);

		const userSearched = await this.userRepository.findByEmail(aUser.email);

		if (userSearched) {
			if (userSearched.status === status.PENDING) {
				throw new Error(
					'Email pendiente de activacion. Por favor, revise su casilla de correo electronico'
				);
			}
			if (await bcrypt.compare(password, userSearched.password)) {
				return userSearched;
			} else {
				throw new Error('Login incorrecto');
			}
		} else {
			throw new Error('Login incorrecto');
		}
	}
}
