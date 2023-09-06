import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePhoto } from 'src/domain/place/case/createPhoto.case';
import { CreatePlace } from 'src/domain/place/case/createPlace.case';
import { DeletePlace } from 'src/domain/place/case/deletePlace.case';
import { FindPlaces } from 'src/domain/place/case/findPlaces.case';
import { UpdatePlace } from 'src/domain/place/case/updatePlace.case';
import { IPhotoRepository } from 'src/domain/place/port/iPhotoRepository';
import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository';
import { Category } from 'src/infrastructure/category/typeorm/model/category.entity';
import { PlaceController } from 'src/infrastructure/place/rest/controller/place.controller';
import { Accessibility } from 'src/infrastructure/place/typeorm/model/accesibility.entity';
import { DayOfWeek } from 'src/infrastructure/place/typeorm/model/day-of-week.entity';
import { PlaceCategory } from 'src/infrastructure/place/typeorm/model/place-category.entity';
import { PlacePhoto } from 'src/infrastructure/place/typeorm/model/place-photo.entity';
import { PlaceSchedule } from 'src/infrastructure/place/typeorm/model/place-schedule.entity';
import { Place } from 'src/infrastructure/place/typeorm/model/place.entity';
import { Service } from 'src/infrastructure/place/typeorm/model/service.entity';
import { PhotoRepository } from 'src/infrastructure/place/typeorm/repository/photo.repository';
import { PlaceRepository } from 'src/infrastructure/place/typeorm/repository/place.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([Place]),
		TypeOrmModule.forFeature([PlacePhoto]),
		TypeOrmModule.forFeature([PlaceSchedule]),
		TypeOrmModule.forFeature([DayOfWeek]),
		TypeOrmModule.forFeature([PlaceCategory]),
		TypeOrmModule.forFeature([Category]),
		TypeOrmModule.forFeature([Accessibility]),
		TypeOrmModule.forFeature([Service]),
	],
	controllers: [PlaceController],
	providers: [
		FindPlaces,
		CreatePlace,
		DeletePlace,
		UpdatePlace,
		CreatePhoto,
		{
			provide: IPlaceRepository,
			useClass: PlaceRepository,
		},
		{
			provide: IPhotoRepository,
			useClass: PhotoRepository,
		},
	],
})
export class PlaceModule {}
