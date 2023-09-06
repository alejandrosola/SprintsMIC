// /infrastructure/user/rest/mapper/user-rest-mapper.ts
import { User } from '../../../../domain/user/model/user.entity';
import { UserPayload } from '../payload/user-payload';

export class UserRestMapper {
	static toPayload(user: User): UserPayload {
		return {
			id: user.id,
			name: user.name,
			fechaNacimiento: user.fechaNacimiento,
			email: user.email,
			status: user.status,
			avatar: user.avatar
		};
	}
}

// function convertMulterFileToFile(multerFile: MulterFile): File {
// 	const blob = new Blob([multerFile.buffer], { type: multerFile.mimetype });
// 	const file = new File([blob], multerFile.originalname, {
// 		type: multerFile.mimetype,
// 		lastModified: Date.now(),
// 	});
// 	return file;
// }
