import { Organization } from '../../organization/typeorm/model/organization.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../user/typeorm/model/user.entity';
import data = require("./json/organizations.json");

export default class OrganizationsSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        console.log("Seeders Organization...");
        const organizationRepository = dataSource.getRepository(Organization);
        const userRepository = dataSource.getRepository(User);

        const users = await userRepository.find();

        const organizationToInsert: Organization[] = await Promise.all(data.map(async (aOrganization) => {
            const organization = new Organization();

            organization.legalName = aOrganization.legalName;
            organization.address = aOrganization.address;
            organization.cuit = aOrganization.cuit;
            organization.phone = aOrganization.phone;
            organization.status = aOrganization.status;

            const ownerUser = users.find(user => user.email === aOrganization.owned.email);
            organization.owner = ownerUser;

            if (aOrganization.validator) {
                const validatorUser = users.find(user => user.email === aOrganization.validator.email);
                organization.validator = validatorUser;
            }

            return organization;
        }));

        const organizations = organizationRepository.create(organizationToInsert);

        await organizationRepository.save(organizations);
    }
}