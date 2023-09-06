import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Role as TypeORMRole } from 'src/infrastructure/user/typeorm/model/role.entity';
import { IRoleRepository } from 'src/domain/user/port/IRoleRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role as DomainRole } from 'src/domain/user/model/role.entity';
import { RoleMapper } from '../mapper/role-typeorm.mapper';

@Injectable()
export class RoleRepository implements IRoleRepository {
    constructor(
        @InjectRepository(TypeORMRole)
        private readonly roleRepository: Repository<TypeORMRole>
    ) { }


    async findByName(name: string): Promise<DomainRole> {
        const role = await this.roleRepository.findOne({ where: { name: name } });
        return role ? RoleMapper.toDomain(role) : null;
    }
}
