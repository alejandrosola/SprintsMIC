import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { typeOrmConfig } from '../typeorm.config';
import { ConfigModule } from '@nestjs/config';

import { User } from './infrastructure/user/typeorm/model/user.entity';
import { Faq } from './infrastructure/faq/typeorm/model/faq.entity';
import { UserModule } from './modules/user.module';

import { Category } from './infrastructure/category/typeorm/model/category.entity';
import { CategoryModule } from './modules/category.module';
import { PlaceModule } from './modules/place.module';
import { Place } from './infrastructure/place/typeorm/model/place.entity';
import { FaqModule } from './modules/faq.module';

import { Organization } from './infrastructure/organization/typeorm/model/organization.entity';
import { OrganizationModule } from './modules/organization.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		ConfigModule.forRoot(),
		TypeOrmModule.forFeature([User]),
		UserModule,
		TypeOrmModule.forFeature([Category]),
		CategoryModule,
		PlaceModule,
		TypeOrmModule.forFeature([Place]),
		TypeOrmModule.forFeature([Organization]),
		OrganizationModule,
		TypeOrmModule.forFeature([Faq]),
		FaqModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
