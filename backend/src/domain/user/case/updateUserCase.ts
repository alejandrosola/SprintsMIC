import { Injectable, Inject } from '@nestjs/common';
import { User } from '../model/user.entity';
import { IUserRepository } from '../port/iUserRepository';
import { iUpdateUser } from '../port/iUpdateUser';
const normalizeEmail = require('normalize-email');
import { MulterFile } from 'multer'; // Import MulterFile type

import { MinioService } from '../../../util/minio.service';

const Minio = new MinioService();

@Injectable()
export class UpdateUser implements iUpdateUser {
    constructor(
        @Inject(IUserRepository)
        private userRepository: IUserRepository
    ) { }

    async update(name: string, email: string, fechaNacimiento: Date, avatar: MulterFile): Promise<User> {

        email = normalizeEmail(email);
        const userSearched = await this.userRepository.findByEmail(email);

        if (!userSearched) {
            throw new Error('Usuario inexistente');
        }
        userSearched.email = email;
        userSearched.name = name;

        if (avatar) {
            await Minio.verifyBucket('avatar', avatar);
            const uri = await Minio.createUR('avatar', avatar.originalName);
            userSearched.avatar = uri;
        }
        if (fechaNacimiento) {
            fechaNacimiento = new Date(fechaNacimiento);
            fechaNacimiento.setDate(fechaNacimiento.getDate() + 1);

            if (fechaNacimiento > new Date()) {
                throw new Error("Fecha de nacimiento incorrecta, no puede ser mayor al día actual.");
            }
            userSearched.fechaNacimiento = fechaNacimiento;
        }

        const userUpdated = await this.userRepository.update(userSearched);
        return userUpdated;

    }
}
