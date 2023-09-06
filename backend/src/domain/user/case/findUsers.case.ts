import { Injectable, Inject } from '@nestjs/common';
import { User } from '../model/user.entity';
import { IUserRepository } from '../port/iUserRepository';
import { IfindUsers } from '../port/iFindUsers';
const normalizeEmail = require('normalize-email');

@Injectable()
export class FindUsers implements IfindUsers {
	constructor(
		@Inject(IUserRepository)
		private readonly userRepository: IUserRepository
	) { }

	async findAll(): Promise<User[]> {
		return this.userRepository.findAll();
	}

	async findByEmail(email: string): Promise<User> {
		email = normalizeEmail(email);
		return this.userRepository.findByEmail(email);
	}
}
