import { User as TypeORMUser } from '../model/user.entity';
import { User as DomainUser } from '../../../../domain/user/model/user.entity';

export class UserMapper {
    static toDomain(user: TypeORMUser): DomainUser {
        const aUser = {
            id: user.id,
            name: user.name || null,
            fechaNacimiento: user.fechaNacimiento || null,
            password: user.password,
            email: user.email,
            status: user.status,
            avatar: user.avatar || null, // Aquí deberías mapear la propiedad avatar en caso de que necesites realizar alguna conversión especial
            roles: user.roles || [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt || null,
        };
        return aUser;
    }

    static toTypeORM(domainUser: DomainUser): TypeORMUser {
        const typeORMUser = new TypeORMUser();
        typeORMUser.id = domainUser.id;
        typeORMUser.name = domainUser?.name || null;
        typeORMUser.fechaNacimiento = domainUser.fechaNacimiento;
        typeORMUser.password = domainUser.password;
        typeORMUser.email = domainUser.email;
        typeORMUser.status = domainUser.status;
        typeORMUser.avatar = domainUser.avatar || null; // Aquí deberías mapear la propiedad avatar en caso de que necesites realizar alguna conversión especial
        typeORMUser.roles = domainUser.roles || null;
        typeORMUser.createdAt = domainUser.createdAt;
        typeORMUser.updatedAt = domainUser.updatedAt;
        typeORMUser.deletedAt = domainUser.deletedAt || null;

        return typeORMUser;
    }
}