import { Controller, Get, Post, Put, Body, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindUsers } from '../../../../domain/user/case/findUsers.case';
import { RegisterUser } from '../../../../domain/user/case/registerUser.case';
import { LoginUser } from '../../../../domain/user/case/loginUser.case';
import { UpdateUser } from 'src/domain/user/case/updateUserCase';
import { User } from '../../../../domain/user/model/user.entity';
import { UserRestMapper } from '../mapper/user-rest-mapper';
import { UserPayload } from '../payload/user-payload';
import { RegisterUserInput } from '../input/register-user-input';
import { responseJson } from 'src/util/responseMessage';
import { LoginUserInput } from '../input/login-user-input';
import { UpdateUserInput } from '../input/update-user.input';
import { MulterFile } from 'multer'; // Import MulterFile type
import { ChangePasswordInput } from '../input/change-password-input';
import { UpdateUserPassword } from 'src/domain/user/case/updateUserPasswordCase';
import { UserForgotPasswordInput } from '../input/user-forgot.password.input';
import { RestoreUserPassword } from 'src/domain/user/case/RestoreUserPassword.case';
import { UserGetPasswordTokenInput } from '../input/user-get-password-token.input';
import { UserRestorePasswordInput } from '../input/user-restore-password.input';

require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

@Controller('users')
export class UserController {

	constructor(
		private readonly findUsers: FindUsers,
		private readonly registerUser: RegisterUser,
		private readonly loginUser: LoginUser,
		private readonly updateUser: UpdateUser,
		private readonly updateUserPassword: UpdateUserPassword,
		private readonly restoreUserPassword: RestoreUserPassword
	) {
	}

	@Get()
	async findAll(): Promise<UserPayload[]> {
		try {
			const someUsers: User[] = await this.findUsers.findAll();
			return responseJson(
				200,
				'Usuarios recuperados con exito',
				someUsers.map((aUser) => {
					return UserRestMapper.toPayload(aUser);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('login')
	async login(@Body() user: LoginUserInput): Promise<UserPayload> {
		try {
			const aUser: User = await this.loginUser.login(user.email, user.password);
			return responseJson(
				200,
				'Login exitoso',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post()
	async register(@Body() user: RegisterUserInput): Promise<UserPayload> {
		try {
			const aUser: User = await this.registerUser.register(
				user.email,
				user.password
			);
			return responseJson(
				200,
				'Usuario registrado con exito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('activate/:id')
	async activate(@Param('id') id: string): Promise<UserPayload> {
		try {
			const aUser: User = await this.registerUser.activate(id);
			return responseJson(
				200,
				'Usuario activado con exito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put()
	@UseInterceptors(FileInterceptor('avatar'))
	async update(@UploadedFile() avatar: MulterFile, @Body() user: UpdateUserInput): Promise<UserPayload> {
		try {
			console.log(user)
			if (avatar) {
				let extension = avatar.originalname.split('.');
				extension = '.' + extension[extension.length - 1];
				avatar.originalName = user.email + extension;
				avatar.mimetype = "image/jpg";
			}
			const aUser: User = await this.updateUser.update(
				user.name, user.email, user.fechaNacimiento, avatar
			);

			return responseJson(
				200,
				'Usuario actualizado con exito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put(':email')
	async changePassword(@Param('email') email: string, @Body() user: ChangePasswordInput): Promise<UserPayload> {
		try {
			const aUser: User = await this.updateUserPassword.changePassword(email, user.actualPassword, user.newPassword, user.checkNewPassword);
			return responseJson(200, 'Contraseña actualizada con exito', UserRestMapper.toPayload(aUser));
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('email/:email')
	async findByMail(@Param('email') email: string): Promise<UserPayload> {
		try {
			const aUser: User = await this.findUsers.findByEmail(email);
			return responseJson(
				200,
				'Usuarios recuperados con exito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('forgotMyPassword')
	async forgotMyPassword(@Body() body: UserForgotPasswordInput): Promise<UserPayload> {
		try {
			// const aUser: User = await this.findUsers.findByEmail(body.email);

			let response = await this.restoreUserPassword.sendPasswordToken(body.email);
			return responseJson(
				200,
				'Usuarios recuperados con exito',
				// UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('passwordToken')
	async getPasswordTokenData(@Body() body: UserGetPasswordTokenInput): Promise<UserPayload> {
		try {
			let response = await this.restoreUserPassword.getPasswordTokenData(body.token);
			return responseJson(
				200,
				'Token recuperado con exito',
				response
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('resetPassword')
	async restorePassword(@Body() body: UserRestorePasswordInput): Promise<UserPayload> {
		try {
			let response = await this.restoreUserPassword.restorePassword(body.email, body.password, body.token);
			return responseJson(
				200,
				'Token recuperado con exito',
				response
				// UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}
}

