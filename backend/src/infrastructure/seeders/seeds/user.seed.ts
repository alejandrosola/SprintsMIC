import { Role } from '../../user/typeorm/model/role.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../user/typeorm/model/user.entity';
const bcrypt = require('bcrypt');
const saltRounds = 10;
import data = require("./json/users.json")

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        console.log("Seeders User...")
        const userRepository = dataSource.getRepository(User);
        const roleRepository = dataSource.getRepository(Role);

        const PRODUCTOR = await roleRepository.findOne({ where: { name: "PRODUCTOR" } });
        const CONSUMIDOR = await roleRepository.findOne({ where: { name: "CONSUMIDOR" } });

        const rolesMap = {
            "PRODUCTOR": PRODUCTOR,
            "CONSUMIDOR": CONSUMIDOR
        }

        const usersToInsert: User[] = await Promise.all(data.map(async (aUser) => {
            const user = new User();  // Crear una instancia de User

            user.name = aUser.name;
            user.email = aUser.email;
            user.password = await bcrypt.hash(aUser.password, saltRounds);
            user.status = aUser.status;
            user.roles = aUser.roles.map((aRole: string) => {
                return rolesMap[aRole]
            });

            return user;
        }));


        const users = userRepository.create(usersToInsert);

        await userRepository.save(users);
    }
}
