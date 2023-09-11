import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from '../typeorm.config';

import { Faq } from './infrastructure/faq/typeorm/model/faq.entity';
import { User } from './infrastructure/user/typeorm/model/user.entity';
import { UserModule } from './modules/user.module';

import { Category } from './infrastructure/category/typeorm/model/category.entity';
import { Place } from './infrastructure/place/typeorm/model/place.entity';
import { CategoryModule } from './modules/category.module';
import { FaqModule } from './modules/faq.module';
import { PlaceModule } from './modules/place.module';

import { Organization } from './infrastructure/organization/typeorm/model/organization.entity';
import { AccesibilityModule } from './modules/accesibility.module';
import { OrganizationModule } from './modules/organization.module';
import { ServiceModule } from './modules/service.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(typeOrmConfig),
		ConfigModule.forRoot(),
		TypeOrmModule.forFeature([User]),
		UserModule,
		TypeOrmModule.forFeature([Category]),
		CategoryModule,
		PlaceModule,
		ServiceModule,
		AccesibilityModule,
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
