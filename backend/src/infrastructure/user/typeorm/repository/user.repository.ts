import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User as TypeORMUser } from 'src/infrastructure/user/typeorm/model/user.entity';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { User as DomainUser } from 'src/domain/user/model/user.entity';
import { UserMapper } from '../mapper/user-typeorm.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@InjectRepository(TypeORMUser)
		private readonly userRepository: Repository<TypeORMUser>
	) { }

	async save(aUser: DomainUser): Promise<DomainUser> {
		const typeORMUser = UserMapper.toTypeORM(aUser);
		const savedUser = await this.userRepository.save(typeORMUser);

		return UserMapper.toDomain(savedUser);
	}

	async findByID(id: string): Promise<DomainUser> {
		const user = await this.userRepository.findOne({ where: { id: id } });
		return user ? UserMapper.toDomain(user) : null;
	}

	async findByEmail(email: string): Promise<DomainUser> {
		const user = await this.userRepository.findOne({ where: { email: email }, relations: ['roles'] });
		return user ? UserMapper.toDomain(user) : null;
	}

	async findAll(): Promise<DomainUser[]> {
		const users = await this.userRepository.find();
		return users.map((user) => UserMapper.toDomain(user));
	}

	async update(aUser: DomainUser): Promise<DomainUser> {
		const typeORMUser = UserMapper.toTypeORM(aUser);
		const updatedUser = await this.userRepository.save(typeORMUser);
		return UserMapper.toDomain(updatedUser);
	}
}
