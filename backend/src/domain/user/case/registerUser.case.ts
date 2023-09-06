import { Injectable, Inject } from '@nestjs/common';
import { User } from '../model/user.entity';
import { IUserRepository } from '../port/iUserRepository';
import { iRegisterUser } from '../port/iRegisterUser';
import { status } from '../model/status.enum';
const normalizeEmail = require('normalize-email');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config();

import { EmailService } from '../../../util/email.service';
import { IRoleRepository } from '../port/IRoleRepository';
const Email = new EmailService();

@Injectable()
export class RegisterUser implements iRegisterUser {
	constructor(
		@Inject(IUserRepository)
		private userRepository: IUserRepository,
		@Inject(IRoleRepository)
		private roleRepository: IRoleRepository
	) { }

	async activate(id: string): Promise<User> {
		const aUser = await this.userRepository.findByID(id);
		if (!aUser) {
			throw new Error('Usuario no existe');
		}

		if (aUser.status === status.ACTIVE) {
			throw new Error('Usuario ya activado');
		}

		aUser.status = status.ACTIVE;

		this.userRepository.update(aUser);

		return aUser;
	}

	async register(email: string, password: string): Promise<User> {
		const aUser = new User();
		aUser.email = normalizeEmail(email);

		if (!this.isEmail(aUser.email)) {
			throw new Error('Email invalido');
		}

		if (!this.isValidPassword(password)) {
			throw new Error('Clave invalida');
		}

		const hashedPassword: string = await bcrypt.hash(password, saltRounds);
		aUser.password = hashedPassword;

		aUser.status = status.PENDING;

		const consumidorRole = await this.roleRepository.findByName("CONSUMIDOR")
		aUser.roles = [consumidorRole]

		const aUserEntity = await this.userRepository.save(aUser);

		const response = await Email.sendActivateUserEmail(aUserEntity.email, aUserEntity.id);
		console.log(response)
		return aUserEntity;
	}

	isEmail(email: string): boolean {
		const regexmail = new RegExp(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
		return regexmail.test(email);
	}

	isValidPassword(password: string): boolean {
		const regularExpression =
			/^(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
		return regularExpression.test(password);
	}
}
