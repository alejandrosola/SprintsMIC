import { Role } from '../model/role.entity';

export interface IRoleRepository {
    findByName(name: string): Promise<Role>;
}

export const IRoleRepository = Symbol('IRoleRepository');
