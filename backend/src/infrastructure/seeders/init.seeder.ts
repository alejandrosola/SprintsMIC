import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';

import CategorySeeder from './seeds/category.seed';
import RoleSeeder from './seeds/roles.seed';
import DayOfWeekSeeder from './seeds/days-of-week.seed';
import PlaceSeeder from './seeds/place.seed';
import ServiceSeeder from './seeds/service.seed';
import AccessibilitySeeder from './seeds/accessibility.seed';
import UserSeeder from './seeds/user.seed';
import FaqSeeder from './seeds/faq.seed';
import OrganizationsSeeder from './seeds/organizations.seed';

export default class InitSeeder implements Seeder {
	public async run(
		dataSource: DataSource,
	): Promise<any> {
		await runSeeders(dataSource, {
			seeds: [RoleSeeder, UserSeeder, CategorySeeder, FaqSeeder, OrganizationsSeeder, DayOfWeekSeeder, ServiceSeeder, AccessibilitySeeder, PlaceSeeder,],
		});
	}
}