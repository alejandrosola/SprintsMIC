import { Module } from '@nestjs/common';
import { UserController } from '../infrastructure/user/rest/controller/user.controller';
import { FindUsers } from '../domain/user/case/findUsers.case';
import { IUserRepository } from '../domain/user/port/iUserRepository';
import { UserRepository } from '../infrastructure/user/typeorm/repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../infrastructure/user/typeorm/model/user.entity';
import { Role } from 'src/infrastructure/user/typeorm/model/role.entity';
import { RegisterUser } from 'src/domain/user/case/registerUser.case';
import { LoginUser } from 'src/domain/user/case/loginUser.case';
import { UpdateUser } from 'src/domain/user/case/updateUserCase';
import { IRoleRepository } from 'src/domain/user/port/IRoleRepository';
import { RoleRepository } from 'src/infrastructure/user/typeorm/repository/role.repository';
import { UpdateUserPassword } from 'src/domain/user/case/updateUserPasswordCase';
import { RestoreUserPassword } from 'src/domain/user/case/RestoreUserPassword.case';
import { IPasswordTokenRepository } from 'src/domain/user/port/iPasswordTokenRepository';
import { PasswordTokenRepository } from 'src/infrastructure/user/typeorm/repository/passwordToken.repository';
import { PasswordToken } from 'src/infrastructure/user/typeorm/model/passwordToken.entity';

@Module({
	imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Role]), TypeOrmModule.forFeature([PasswordToken])],
	controllers: [UserController],
	providers: [
		FindUsers,
		RegisterUser,
		LoginUser,
		UpdateUser,
		UpdateUserPassword,
		RestoreUserPassword,
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},
		{
			provide: IRoleRepository,
			useClass: RoleRepository,
		},
		{
			provide: IPasswordTokenRepository,
			useClass: PasswordTokenRepository,
		},
	],
})
export class UserModule { }
