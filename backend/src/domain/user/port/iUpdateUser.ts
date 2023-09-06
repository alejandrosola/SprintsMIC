import { User } from '../model/user.entity';
import { MulterFile } from 'multer'; // Import MulterFile type

export interface iUpdateUser {
    update(name: string, email: string, fechaNacimiento: Date, avatar: MulterFile): Promise<User>;
}