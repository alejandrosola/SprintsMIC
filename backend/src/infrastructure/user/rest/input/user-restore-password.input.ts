import { PasswordToken } from "src/domain/user/model/passwordToken.entity";

export class UserRestorePasswordInput {
    email: string;
    password: string;
    token: string;
}